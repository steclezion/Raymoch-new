# cti_engine.py — Comprehensive Trust Index (CTI) + Tier Grading
# -----------------------------------------------------------------------------
# Purpose
#   Compute a normalized 0–100 trust score (CTI) for an entity from its
#   evidence tokens; apply category weights, penalties, and time decay; then
#   assign a tier label with gates AND a finer letter grade (A+..F) that
#   aligns with tiers but adds nuance for ops/compliance.
#
# Design Guarantees
#   - Categories (ID/OP/REP/CON/RISK) each live on [0,100]
#   - Global CTI lives on [0,100]
#   - Weights sum to 1.00 (see WEIGHTS)
#   - Penalties P ≥ 0, bounded by per-code caps; "hold" can freeze upgrades
#   - Decay D ∈ [0,10] (Phase I: −1 per 90 days since last verification)
#   - Eligibility gates can LOWER the TIER LABEL (not the numeric CTI)
#   - Grading layer sits AFTER CTI/tier; it can demote the letter grade
#
# Expected Inputs (entity model; tolerant to dict-like tokens)
#   - ent.tokens: list[Token|dict] with fields:
#       .category in {"id","op","rep","con","risk"}  # primary category
#       .token_type in {"vt","at","ft"}              # verified, auxiliary, field
#       .base_points: float                          # fixed ledger base value
#       .confidence: float in [0.5,1.0]              # reviewer/posterior mean
#       .source_family: str                          # issuer/provider family
#       .issued_at: datetime                         # for recency
#       .status in {"pending","approved","rejected"}
#   - ent.penalties (optional): list with
#       .code: str, .points: int, .active: bool, .hold: bool
#   - ent.last_verification_at (optional datetime) — preferred for decay
#   - ent.decay_points (optional float) — legacy fallback if timestamps missing
#
# Public API (unchanged function *names*)
#   - score_categories(tokens) -> tuple[float, float, float, float, float]
#   - _tier_for(cti: float) -> str
#   - _weighted_sum(S: tuple[...]) -> float
#   - recompute_cti(db: Session, entity_id: str) -> dict
#
# Return payload (non-breaking addition):
#   - Adds "grade": str  (letter grade aligned to tier ranges, with overrides)
# -----------------------------------------------------------------------------


from __future__ import annotations
from datetime import datetime
from collections import defaultdict
from typing import Any, Iterable, Tuple
from sqlalchemy.orm import Session
from db import Entity, Event


# --------------------------- Policy Constants (Phase I) ----------------------

# Category weights (must sum to 1.00)
WEIGHTS = {"id": 0.25, "op": 0.25, "rep": 0.20, "con": 0.15, "risk": 0.15}

# Tier cutoffs (descending); label will be adjusted by eligibility gates later
TIERS = [("Platinum", 85.0), ("Gold", 70.0), ("Silver", 55.0)]  # else "Bronze"

# Token-type multipliers (verified > auxiliary > field)
_TYPE_MULT = {"vt": 1.00, "at": 0.60, "ft": 0.40}

# Within-category recency: linear to 0.7 by 12 months (then floored)
_RECENCY_MIN = 0.70
_RECENCY_MONTHS_TO_MIN = 12.0

# Source diversity: at most 60 points per category from a single source family
_PER_SOURCE_CAP = 60.0

# Diminishing returns: above 85 within a category, tail contributions ×0.25
_DIMINISH_THRESHOLD = 85.0
_DIMINISH_TAIL_FACTOR = 0.25

# Decay: -1 CTI per 90 days since last verification event, max 10 (linear Phase I)
_DECAY_STEP_DAYS = 90
_DECAY_STEP_POINTS = 1
_DECAY_MAX = 10

# Penalties (discrete subtractive, with optional caps and hold behavior)
# If Penalty objects already carry .points and .hold, those are used;
# this mapping supplies default values + per-code caps.
_PENALTY_CONFIG = {
    "IDENTITY_MISMATCH": {"points": 15, "cap": 30, "hold": False},
    "OP_INCONSISTENCY":  {"points":  8, "cap": 16, "hold": False},
    "ADVERSE_OR_PEP":    {"points": 20, "cap": None, "hold": True},
    "MISSING_FOR_SILVER":{"points": 10, "cap": None, "hold": False},
    "OPEN_DISPUTE":      {"points":  6, "cap": 12, "hold": False},
}


# ------------------------------ Small Utilities ------------------------------

def _now() -> datetime:
    return datetime.utcnow()

def _clamp(x: float, lo: float, hi: float) -> float:
    return hi if x > hi else lo if x < lo else x

def _get(obj: Any, name: str, default=None):
    """Safely get attribute or dict key (for admin-imported dict-like tokens)."""
    if hasattr(obj, name):
        return getattr(obj, name)
    if isinstance(obj, dict):
        return obj.get(name, default)
    return default

def _recency_factor(issued_at: datetime | None, now: datetime) -> float:
    """
    Linear decay down to _RECENCY_MIN by _RECENCY_MONTHS_TO_MIN months.
    Missing timestamp -> treat as fresh (1.0) to avoid silent penalties.
    """
    if not isinstance(issued_at, datetime):
        return 1.0
    months = max(0.0, (now - issued_at).days / 30.0)
    decay_portion = (1.0 - _RECENCY_MIN) * (months / _RECENCY_MONTHS_TO_MIN)
    return max(_RECENCY_MIN, 1.0 - decay_portion)


# --------------------------- Category Aggregation ----------------------------

def _aggregate_category(tokens: Iterable[Any], now: datetime) -> float:
    """
    Sum item contributions with:
      - per-source-family cap (<= 60)
      - diminishing returns beyond 85 (×0.25 tail)
      - clamp category at 100

    Item contribution formula (per spec):
      v = base_points × type_multiplier × confidence × recency
    """
    by_source: dict[str, float] = defaultdict(float)  # track cap per family
    raw_sum = 0.0

    for t in tokens:
        base_points = float(_get(t, "base_points", 0.0))
        if base_points <= 0.0:
            continue

        token_type = (_get(t, "token_type", "ft") or "ft").lower()
        mtype = _TYPE_MULT.get(token_type, _TYPE_MULT["ft"])

        confidence = float(_clamp(float(_get(t, "confidence", 1.0)), 0.5, 1.0))
        recency = _recency_factor(_get(t, "issued_at", None), now)
        v = base_points * mtype * confidence * recency
        if v <= 0:
            continue

        fam = _get(t, "source_family", None) or "unknown"
        remaining_for_source = max(0.0, _PER_SOURCE_CAP - by_source[fam])
        if remaining_for_source <= 0.0:
            continue  # source-family quota already maxed

        inc = min(v, remaining_for_source)
        by_source[fam] += inc
        raw_sum += inc

    # Apply diminishing returns beyond the threshold
    if raw_sum <= _DIMINISH_THRESHOLD:
        score = raw_sum
    else:
        score = _DIMINISH_THRESHOLD + (raw_sum - _DIMINISH_THRESHOLD) * _DIMINISH_TAIL_FACTOR

    return _clamp(score, 0.0, 100.0)


# ------------------------------ Public API ----------------------------------

def score_categories(tokens) -> Tuple[float, float, float, float, float]:
    """
    Compute per-category scores on [0,100] for:
      (Identity, Operational, Reputation, Consistency, Risk)

    Rules implemented:
      - Per-item contribution: base_points × type_multiplier × confidence × recency
      - Per-source-family cap: max 60 points per category from one issuer family
      - Diminishing returns: above 85, new contributions are ×0.25
      - Each category is clamped to [0,100]
    """
    now = _now()
    T = list(tokens or [])

    def _cat(t) -> str | None:
        return _get(t, "category", None)

    S_id   = _aggregate_category((t for t in T if _cat(t) == "id"),   now)
    S_op   = _aggregate_category((t for t in T if _cat(t) == "op"),   now)
    S_rep  = _aggregate_category((t for t in T if _cat(t) == "rep"),  now)
    S_con  = _aggregate_category((t for t in T if _cat(t) == "con"),  now)
    S_risk = _aggregate_category((t for t in T if _cat(t) == "risk"), now)

    return (S_id, S_op, S_rep, S_con, S_risk)

def _tier_for(cti: float) -> str:
    """Map numeric CTI to label (gates can still lower the label later)."""
    for name, cutoff in TIERS:
        if cti >= cutoff:
            return name
    return "Bronze"

def _weighted_sum(S: Tuple[float, float, float, float, float]) -> float:
    """Weighted sum of category scores (already on 0–100), yields 0–100 base."""
    return (
        WEIGHTS["id"]   * S[0] +
        WEIGHTS["op"]   * S[1] +
        WEIGHTS["rep"]  * S[2] +
        WEIGHTS["con"]  * S[3] +
        WEIGHTS["risk"] * S[4]
    )


# --------------------------- Penalties & Decay -------------------------------

def _sum_penalties(penalties: Iterable[Any] | None) -> tuple[float, bool]:
    """
    Sum active penalties with per-code caps.
    Returns: (total_points, hold_flag)
    - If Penalty object supplies .points/.hold they take precedence.
    - Otherwise falls back to _PENALTY_CONFIG defaults.
    """
    if not penalties:
        return 0.0, False

    bucket: dict[str, float] = defaultdict(float)
    hold = False

    for p in penalties:
        if not _get(p, "active", True):
            continue
        code = _get(p, "code", None) or "UNKNOWN"
        cfg = _PENALTY_CONFIG.get(code, {})
        val = float(_get(p, "points", cfg.get("points", 0)))
        bucket[code] += max(0.0, val)
        # hold can come from penalty object or config
        hold = hold or bool(_get(p, "hold", cfg.get("hold", False)))

    total = 0.0
    for code, subtotal in bucket.items():
        cap = _PENALTY_CONFIG.get(code, {}).get("cap", None)
        total += min(subtotal, float(cap)) if cap else subtotal

    return total, hold


def _compute_decay(last_verified_at: datetime | None, legacy_points: float | None) -> float:
    """
    Preferred: compute linear decay from last_verified_at.
    Fallback: use legacy numeric ent.decay_points if timestamps are absent.
    """
    if isinstance(last_verified_at, datetime):
        days = max(0, (_now() - last_verified_at).days)
        steps = (days // _DECAY_STEP_DAYS) * _DECAY_STEP_POINTS
        return float(min(_DECAY_MAX, steps))
    # Legacy path for older schemas
    if legacy_points is None:
        return 0.0
    return float(_clamp(float(legacy_points), 0.0, float(_DECAY_MAX)))


# ------------------------------ Grading Layer --------------------------------
# Map numeric CTI to a letter grade (fine-grained) that aligns with your tiers.
# Then apply policy overrides (hold, heavy penalties, staleness, lopsided breadth).

_GRADE_BINS = [
    (95.0, "A+"), (90.0, "A"), (85.0, "A-"),
    (80.0, "B+"), (75.0, "B"), (70.0, "B-"),
    (65.0, "C+"), (60.0, "C"), (55.0, "C-"),
    (45.0, "D+"), (30.0, "D"), (20.0, "D-"),
    (0.0,  "F"),
]
_GRADE_ORDER = ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","D-","F"]

def _base_grade_from_cti(cti: float) -> str:
    for cutoff, label in _GRADE_BINS:
        if cti >= cutoff:
            return label
    return "F"

def _demote_one(label: str) -> str:
    try:
        i = _GRADE_ORDER.index(label)
    except ValueError:
        return "F"
    return _GRADE_ORDER[min(i+1, len(_GRADE_ORDER)-1)]

def _grade_for(cti: float, hold: bool, P: float, D: float,
               S_off: tuple[float,float,float,float,float]) -> str:
    """
    Deterministic grading rules applied AFTER CTI & Tier:
      1) Hold override -> "F (Hold)"
      2) Heavy penalties (P >= 20) -> demote one step
      3) Staleness (D >= 8) -> demote one step
      4) Lopsided breadth (fewer than 2 categories >= 40) -> demote one step
    """
    if hold:
        return "F (Hold)"
    grade = _base_grade_from_cti(cti)
    if P >= 20.0:
        grade = _demote_one(grade)
    if D >= 8.0:
        grade = _demote_one(grade)
    breadth = sum(1 for s in S_off if s >= 40.0)
    if breadth < 2:
        grade = _demote_one(grade)
    return grade


# ---------------------------- Main Recompute --------------------------------

def recompute_cti(db: Session, entity_id: str):
    """
    Full recompute & change-aware persistence.
      1) Load entity, tokens, penalties
      2) OFFICIAL path: approved tokens only -> categories -> weighted base
      3) Subtract penalties P and decay D -> clamp to [0,100]
      4) Compute PROVISIONAL (approved+pending) in parallel (admin visibility)
      5) Eligibility gates may lower TIER LABEL (numeric CTI unchanged)
      6) Grade from numeric CTI (+ overrides)
      7) Persist only if CTI or tier actually changed (no event spam)
    """
    ent = db.get(Entity, entity_id)
    if not ent:
        return {"error": "entity_not_found"}

    tokens = list(ent.tokens or [])

    # OFFICIAL = approved only
    approved = [t for t in tokens if _get(t, "status", None) == "approved"]
    S_off = score_categories(approved)
    base = _weighted_sum(S_off)

    # Penalties & decay
    P, hold = _sum_penalties(getattr(ent, "penalties", None))
    D = _compute_decay(getattr(ent, "last_verification_at", None),
                       getattr(ent, "decay_points", None))

    cti = round(_clamp(base - P - D, 0.0, 100.0), 2)

    # PROVISIONAL = approved + pending (for admin consoles / previews)
    pendingish = [t for t in tokens if _get(t, "status", None) in ("pending", "approved")]
    S_prov = score_categories(pendingish)
    provisional = round(_clamp(_weighted_sum(S_prov) - P - D, 0.0, 100.0), 2)

    # Base tier from numeric CTI
    new_tier = _tier_for(cti)

    # -------------------- Eligibility Gates (label ONLY) --------------------
    # Gold: at least 2 categories >= 60
    # Platinum: at least 3 categories >= 70
    cats_ge_60 = sum(1 for s in S_off if s >= 60.0)
    cats_ge_70 = sum(1 for s in S_off if s >= 70.0)

    if new_tier == "Platinum" and cats_ge_70 < 3:
        new_tier = "Gold"
    if new_tier == "Gold" and cats_ge_60 < 2:
        # If numeric CTI <55 it would be Bronze; otherwise force Silver
        new_tier = "Silver" if cti >= 55.0 else "Bronze"

    # ------------------------------ Grading ---------------------------------
    grade = _grade_for(cti, hold, P, D, S_off)

    # -------------------------- Persist on change ---------------------------
    prev_cti = getattr(ent, "cti", None)
    prev_tier = getattr(ent, "tier", None)

    ent.cti = cti
    ent.tier = new_tier

    if prev_cti != cti or prev_tier != new_tier:
        db.add(Event(
            entity_id=entity_id,
            msg=f"cti:{cti} tier:{new_tier} (recomputed)"
        ))
        db.commit()

    # ---------------------------- Return payload ----------------------------
    return {
        "entity_id": entity_id,
        "cti": ent.cti,                 # official numeric CTI
        "tier": ent.tier,               # label (after gate adjustments)
        "grade": grade,                 # qualitative grade aligned to tiers
        "provisional_cti": provisional, # admin-only view
        "hold": hold                    # true if adverse/PEP unresolved, etc.
    }
