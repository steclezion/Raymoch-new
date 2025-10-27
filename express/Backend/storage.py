# storage.py — single source of truth for file persistence (hardened)
from pathlib import Path
import hashlib, time, os

BASE = Path("storage")
BASE.mkdir(parents=True, exist_ok=True)

# Keep names the same to avoid churn elsewhere
ALLOWED = {"application/pdf", "image/png", "image/jpeg", "text/plain"}
MAX_BYTES = 5 * 1024 * 1024  # 5 MB

def _safe_name(name: str) -> str:
    # Strip any path tricks and control chars, cap length
    base = os.path.basename(name or "")
    base = base.replace("\x00", "")
    return base[:200] or f"upload_{int(time.time())}"

def _normalize_ct(ct: str | None) -> str:
    ct = (ct or "").strip()
    return ct if ct else "application/octet-stream"

def save_upload(entity_id: str, filename: str, content: bytes, content_type: str):
    # Type & size guards
    if not isinstance(content, (bytes, bytearray)):
        raise ValueError("bad_payload")
    size = len(content)
    if size == 0 or size > MAX_BYTES:
        raise ValueError("bad_size")

    # Content-type allowlist (normalize first)
    content_type = _normalize_ct(content_type)
    if content_type not in ALLOWED:
        raise ValueError("unsupported_type")

    # Digest + safe path
    digest = hashlib.sha256(content).hexdigest()
    folder = BASE / str(entity_id)
    folder.mkdir(parents=True, exist_ok=True)

    ts = int(time.time())
    safe = _safe_name(filename)
    out = folder / f"{ts}_{digest[:12]}_{safe}"

    out.write_bytes(content)
    return digest, str(out)
