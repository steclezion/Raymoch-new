# main.py — Raymoch API (defensive wiring: previewable files + CTI tuning)
import os
import json
import logging
from datetime import datetime
from typing import List, Optional

from fastapi import (
    FastAPI, Depends, status, Request, HTTPException,
    UploadFile, File, Query
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text

# ----- DB + Engines -----
from db import init_db, get_db, Entity  # your db.py must export these
from verify_submission import verify_submission as do_verify

# Try to import optional helpers; fall back if missing
_cti_has_scoreconfig = False
_cti_has_preview = False
try:
    from cti_engine import recompute_cti
except Exception as e:
    raise RuntimeError("cti_engine.py must export recompute_cti(db, entity_id, ...).") from e

try:
    from cti_engine import ScoreConfig  # optional
    _cti_has_scoreconfig = True
except Exception:
    ScoreConfig = None  # type: ignore

try:
    from cti_engine import preview_with_weights  # optional
    _cti_has_preview = True
except Exception:
    preview_with_weights = None  # type: ignore

APP_NAME = "Raymoch API"
APP_VERSION = "0.1.0"

# -------- Logging --------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s :: %(message)s",
)
log = logging.getLogger("raymoch")

# -------- App --------
app = FastAPI(title=APP_NAME, version=APP_VERSION)

# Serve /static (for admin.html)
if os.path.isdir("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

# -------- CORS (development-open, test connectivity) --------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[],                 # leave empty for regex override
    allow_origin_regex=r".*",         # allow ANY origin (DEV ONLY)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- Integrity error handler --------
@app.exception_handler(IntegrityError)
async def integrity_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=400,
        content={"ok": False, "error": "integrity_error", "hint": "Possibly duplicate id or unique violation"},
    )

# -------- Lifecycle --------
@app.on_event("startup")
def _startup() -> None:
    init_db()
    log.info("DB initialized. Ready. (If schema changed, confirm raymoch.db path)")
    log.info("CORS is currently OPEN for dev testing. Lock it down after confirming connection.")

# -------- Request logging (for visibility) --------
@app.middleware("http")
async def log_requests(request: Request, call_next):
    log.info("REQ %s %s origin=%s", request.method, request.url.path, request.headers.get("origin"))
    resp = await call_next(request)
    log.info("RES %s %s -> %s", request.method, request.url.path, resp.status_code)
    return resp

# -------- Models --------
class EntityIn(BaseModel):
    id: str
    name: str
    work_email: EmailStr

class EntityOut(BaseModel):
    id: str
    name: str | None = None
    status: str

# ======== Health / Diag ========
@app.get("/health", status_code=status.HTTP_200_OK)
def health():
    return {
        "ok": True,
        "app": APP_NAME,
        "version": APP_VERSION,
        "ts": datetime.utcnow().isoformat() + "Z",
    }

@app.get("/diag", include_in_schema=False)
def diag(db: Session = Depends(get_db)):
    # Check verifications table columns (best-effort)
    cols = []
    try:
        res = db.execute(text("PRAGMA table_info(verifications)")).fetchall()
        cols = [r[1] for r in res] if res else []
    except Exception:
        cols = []
    return {
        "cti_has_scoreconfig": _cti_has_scoreconfig,
        "cti_has_preview_with_weights": _cti_has_preview,
        "verifications_columns": cols,
        "static_admin": os.path.exists(os.path.join("static", "admin.html")),
    }

# =========================
# Verifications (list + status + file preview)
# =========================
@app.get("/verifications")
def list_verifications(entity_id: str = Query(...), db: Session = Depends(get_db)):
    rows = db.execute(text("""
        SELECT id, entity_id, doc_type, filename, status, uploaded_at, decided_at
        FROM verifications
        WHERE entity_id = :eid
        ORDER BY COALESCE(decided_at, uploaded_at) DESC
    """), {"eid": entity_id}).fetchall()
    return [
        {
            "id": r[0], "entity_id": r[1], "doc_type": r[2], "filename": r[3],
            "status": r[4], "uploaded_at": r[5], "decided_at": r[6]
        } for r in rows
    ]

class VerifStatusIn(BaseModel):
    status: str
    notes: str | None = None

@app.post("/verifications/{verif_id}/status")
def set_verification_status(verif_id: int, body: VerifStatusIn, db: Session = Depends(get_db)):
    status_val = (body.status or "").lower()
    if status_val not in {"approved", "rejected", "pending"}:
        raise HTTPException(status_code=400, detail="bad_status")

    db.execute(text("""
        UPDATE verifications
        SET status = :s, decided_at = datetime('now')
        WHERE id = :id
    """), {"s": status_val, "id": verif_id})
    db.commit()

    # Best-effort event log
    try:
        eid = db.execute(text("SELECT entity_id FROM verifications WHERE id=:id"), {"id": verif_id}).scalar()
        db.execute(text("""
            INSERT INTO events(entity_id, type, payload, occurred_at)
            VALUES(:eid, :t, :p, datetime('now'))
        """), {"eid": eid or "unknown", "t": "verification_decision",
               "p": json.dumps({"verif_id": verif_id, "status": status_val, "notes": body.notes})})
        db.commit()
    except Exception as e:
        log.debug("event log skipped: %s", e)

    return {"ok": True, "id": verif_id, "status": status_val}

# --- Stream a verification's file inline (PDF/image previews work) ---
@app.get("/verifications/{verif_id}/file")
def serve_verification_file(verif_id: int, db: Session = Depends(get_db)):
    row = db.execute(text("""
        SELECT filename,
               COALESCE(storage_key, '') AS storage_key,
               COALESCE(content_type, '') AS content_type
        FROM verifications
        WHERE id = :id
    """), {"id": verif_id}).first()
    if not row:
        raise HTTPException(status_code=404, detail="verification_not_found")

    filename, storage_key, content_type = row
    # Try storage_key first (digest.ext), then fall back to raw filename
    candidates = []
    if storage_key:
        candidates.append(os.path.join("storage", storage_key))
    if filename:
        candidates.append(os.path.join("storage", filename))

    for path in candidates:
        if os.path.exists(path):
            return FileResponse(
                path,
                media_type=content_type or "application/octet-stream",
                headers={"Content-Disposition": f'inline; filename="{filename or os.path.basename(path)}"'}
            )

    raise HTTPException(status_code=404, detail="file_not_found")

# Fallback: direct file by id/name (legacy)
@app.get("/files/{file_id}")
def get_file(file_id: str):
    path = os.path.join("storage", file_id)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="file_not_found")
    return FileResponse(path, media_type="application/octet-stream")

# =========================
# Entities CRUD (minimal)
# =========================
@app.get("/entities", response_model=List[EntityOut])
def list_entities(db: Session = Depends(get_db)):
    rows = db.query(Entity).with_entities(Entity.id, Entity.name, Entity.status).all()
    return [{"id": r[0], "name": r[1], "status": r[2]} for r in rows]

@app.post("/entities", status_code=status.HTTP_201_CREATED)
def create_entity(body: EntityIn, db: Session = Depends(get_db)):
    now = datetime.utcnow()
    e = Entity(
        id=body.id,
        name=body.name,
        work_email=body.work_email,
        status="pending",
        decay_points=0,
        cti=0.0,
        tier="Bronze",
        created_at=now,
        updated_at=now,
    )
    db.add(e)
    db.commit()
    return {"created": e.id}

# =========================
# Upload
# =========================
@app.post("/submit/", status_code=status.HTTP_201_CREATED)
async def submit_file(
    entity_id: str = Query(..., min_length=1),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    try:
        content = await file.read()
        log.info("UPLOAD name=%s type=%s size=%sB entity=%s",
                 file.filename, file.content_type, len(content), entity_id)

        out = do_verify(
            db=db,
            entity_id=entity_id,
            filename=file.filename or "upload.bin",
            content=content,
            content_type=file.content_type or "application/octet-stream",
        )

        if isinstance(out, dict) and out.get("duplicate"):
            return {"ok": True, "duplicate": True, "digest": out.get("digest")}

        token_id = getattr(out, "id", None) or (out.get("id") if isinstance(out, dict) else None)
        return {"ok": True, "token_id": token_id}

    except ValueError as ve:
        log.warning("Upload validation error: %s", ve)
        raise HTTPException(status_code=400, detail=str(ve))
    except IntegrityError:
        raise HTTPException(status_code=400, detail="integrity_error")
    except Exception as e:
        log.exception("Upload failed: %s", e)
        raise HTTPException(status_code=500, detail="upload_failed_internal")

# =========================
# CTI (current compute + preview/apply with weights) — defensive
# =========================
@app.get("/entities/{entity_id}/cti", status_code=status.HTTP_200_OK)
def get_cti(entity_id: str, db: Session = Depends(get_db)):
    res = recompute_cti(db, entity_id)  # your existing function
    if isinstance(res, dict) and res.get("error") == "entity_not_found":
        raise HTTPException(status_code=404, detail="entity_not_found")
    return res

class CTIWeights(BaseModel):
    verification: float | None = None
    consistency:  float | None = None
    network:      float | None = None
    traction:     float | None = None
    version_tag:  str | None   = None
    decay_days:   int | None   = None  # optional override

def _norm_weights(w: dict[str, Optional[float]]) -> dict[str, float]:
    # Drop None, clamp >=0, normalize to 1
    w2 = {k: max(0.0, float(v)) for k, v in w.items() if v is not None}
    s = sum(w2.values()) or 1.0
    return {k: (v / s) for k, v in w2.items()}

def _log_event(db: Session, entity_id: str, etype: str, payload: dict):
    try:
        db.execute(text("""
            INSERT INTO events(entity_id, type, payload, occurred_at)
            VALUES(:eid, :t, :p, datetime('now'))
        """), {"eid": entity_id, "t": etype, "p": json.dumps(payload)})
        db.commit()
    except Exception as e:
        log.debug("event log skipped: %s", e)

def _recompute_safe(db: Session, entity_id: str, cfg=None, dry_run: bool = False):
    """
    Calls recompute_cti with whatever signature your cti_engine supports.
    Falls back to basic call if extended params aren't accepted.
    """
    try:
        return recompute_cti(db, entity_id, cfg=cfg, dry_run=dry_run)  # type: ignore
    except TypeError:
        # Old signature: recompute_cti(db, entity_id)
        return recompute_cti(db, entity_id)

@app.post("/entities/{entity_id}/cti/preview")
def cti_preview(entity_id: str, body: CTIWeights, db: Session = Depends(get_db)):
    weights = _norm_weights({
        "verification": body.verification,
        "consistency":  body.consistency,
        "network":      body.network,
        "traction":     body.traction,
    })
    version = body.version_tag or "v1.0-preview"

    # If preview_with_weights is present, use it; else do a best-effort recompute
    if _cti_has_preview and callable(preview_with_weights):
        try:
            return {"preview": preview_with_weights(db, entity_id, new_weights=weights, version_tag=version)}  # type: ignore
        except TypeError:
            # preview_with_weights exists but different signature — fall back
            pass

    # Fallback: just return current recompute; include the requested weights for transparency
    out = _recompute_safe(db, entity_id, cfg=(ScoreConfig(version=version, weights=weights) if _cti_has_scoreconfig else None), dry_run=True)
    return {"preview": out, "weights_used": weights, "note": "preview_with_weights not available; using fallback"}

@app.post("/entities/{entity_id}/cti/recompute")
def cti_apply(entity_id: str, body: CTIWeights, db: Session = Depends(get_db)):
    weights = _norm_weights({
        "verification": body.verification,
        "consistency":  body.consistency,
        "network":      body.network,
        "traction":     body.traction,
    })
    version = body.version_tag or "v1.1-admin"
    cfg = ScoreConfig(version=version, weights=weights) if _cti_has_scoreconfig else None

    before = _recompute_safe(db, entity_id, cfg=(ScoreConfig(version="v1.0") if _cti_has_scoreconfig else None), dry_run=True)
    after  = _recompute_safe(db, entity_id, cfg=cfg, dry_run=False)
    _log_event(db, entity_id, "cti_admin_apply", {
        "version": version, "weights": weights,
        "before": (before or {}).get("score") if isinstance(before, dict) else None,
        "after": (after or {}).get("score") if isinstance(after, dict) else None,
    })
    return {"applied": after, "weights_used": weights}

# -------- Admin attachment (sqladmin) --------
from admin import attach_admin
attach_admin(app)  # -> http://127.0.0.1:8000/admin

# -------- Root & favicon --------
@app.get("/", include_in_schema=False)
def root():
    return {
        "ok": True,
        "message": "Raymoch API",
        "health": "/health",
        "admin_console": "/static/admin.html"
    }

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return PlainTextResponse("", status_code=204)
