# verify_submission.py — intake → token creation → persist (Phase I, hardened)
from __future__ import annotations
from datetime import datetime
from uuid import uuid4
from hashlib import sha256
from typing import Union

from sqlalchemy import select, exists, and_
from sqlalchemy.orm import Session

from db import Token, Entity, Event
from storage import save_upload

def weight_by_type(t: str) -> float:
    # vt > at > ft (Phase I defaults)
    return {"vt": 1.0, "at": 0.6, "ft": 0.4}.get(t, 0.5)

def classify_proof(filename: str, content_type: str) -> str:
    # PDFs/images count as vt; text/other = at (simple heuristic)
    return "vt" if content_type in {"application/pdf", "image/png", "image/jpeg"} else "at"

def _normalize_content_type(ct: Union[str, None]) -> str:
    # Avoid None/empty causing downstream rejections or weird hashes
    return (ct or "").strip() or "application/octet-stream"

def verify_submission(db: Session, entity_id: str, filename: str, content: bytes, content_type: str):
    # ---- Input guards (cheap and essential)
    if not isinstance(content, (bytes, bytearray)) or len(content) == 0:
        raise ValueError("empty_or_invalid_payload")
    content_type = _normalize_content_type(content_type)

    # ---- Ensure entity exists (lazy create; no pre-commit required)
    ent = db.get(Entity, entity_id)
    if ent is None:
        ent = Entity(id=entity_id, status="pending")
        db.add(ent)

    # ---- Idempotency: compute digest first, reject duplicates fast
    digest = sha256(content).hexdigest()
    dup_exists = db.execute(
        select(exists().where(and_(Token.entity_id == entity_id, Token.digest == digest)))
    ).scalar()
    if dup_exists:
        db.add(Event(entity_id=entity_id, msg=f"token:duplicate digest={digest[:10]}"))
        db.commit()
        return {"duplicate": True, "digest": digest}

    # ---- Persist to disk via single storage layer
    digest2, path = save_upload(entity_id, filename, content, content_type)
    if digest2 != digest:
        # Extremely unlikely; sanity check to catch disk/hash drift
        raise RuntimeError("digest_mismatch_after_write")

    # ---- Create token (pending by default; admin approves later)
    tok_type = classify_proof(filename, content_type)
    tok = Token(
        id=str(uuid4()),
        entity_id=entity_id,
        token_type=tok_type,
        status="pending",
        weight=weight_by_type(tok_type),
        confidence=0.5,
        digest=digest,
        meta={"filename": filename, "content_type": content_type, "path": path},
        issued_at=datetime.utcnow(),
        verified_at=None,
    )

    db.add(tok)
    db.add(Event(entity_id=entity_id, msg=f"token:{tok_type} received (pending)"))
    db.commit()
    db.refresh(tok)
    return tok
