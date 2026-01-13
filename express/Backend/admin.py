# admin.py — FastAPI Admin for your SQLite (sqladmin)
from __future__ import annotations

import json
from typing import Any, Dict, Optional
from markupsafe import Markup   # add this import at top


from fastapi import FastAPI
from sqladmin import Admin, ModelView

# === Bring your existing DB objects ===
# Required: engine, Base, Entity, Event
# Optional: Verification, MetricsDaily (if you have them)
from db import engine, Base, Entity, Event  # type: ignore

# Soft imports for optional tables
try:
    from db import Verification  # type: ignore
except Exception:
    Verification = None

try:
    from db import MetricsDaily  # type: ignore
except Exception:
    MetricsDaily = None


# ---------- Helpers ----------

def _pretty_json(value: Any, max_len: int = 1200) -> str:
    """
    Best-effort pretty-printer for JSON-ish columns (TEXT/JSON).
    Falls back to str(value). Truncates long blobs so the table stays usable.
    """
    if value is None:
        return ""
    if isinstance(value, (dict, list)):
        s = json.dumps(value, indent=2, ensure_ascii=False)
    else:
        s = str(value)
        # Try to parse JSON strings
        try:
            s = json.dumps(json.loads(s), indent=2, ensure_ascii=False)
        except Exception:
            pass
    if len(s) > max_len:
        return s[:max_len] + "\n… (truncated)"
    return s


def _numeric_columns(sqlalchemy_table) -> list[str]:
    return [
        c.name
        for c in sqlalchemy_table.columns
        if c.type.__class__.__name__ in ("Integer", "BigInteger", "Float", "Numeric")
    ]


def _text_columns(sqlalchemy_table) -> list[str]:
    return [
        c.name
        for c in sqlalchemy_table.columns
        if c.type.__class__.__name__ in ("String", "Text")
    ]


def _datetime_columns(sqlalchemy_table) -> list[str]:
    return [
        c.name
        for c in sqlalchemy_table.columns
        if c.type.__class__.__name__ in ("DateTime", "Date")
    ]


# ---------- Model Views ----------

class EntityAdmin(ModelView, model=Entity):
    name = "Entity"
    name_plural = "Entities"
    icon = "fa-solid fa-building"
    page_size = 25

    column_list = [c.name for c in Entity.__table__.columns]
    column_details_list = column_list

    column_searchable_list = _text_columns(Entity.__table__)
    column_sortable_list = _numeric_columns(Entity.__table__) + _datetime_columns(Entity.__table__)

    can_create = True
    can_edit = True
    can_delete = False


class EventAdmin(ModelView, model=Event):
    name = "Event"
    name_plural = "Events"
    icon = "fa-solid fa-clock-rotate-left"
    page_size = 50

    column_list = [c.name for c in Event.__table__.columns]
    column_details_list = column_list
    column_searchable_list = ["type"]
    column_sortable_list = ["occurred_at", "id"]

    # Pretty-print JSON-ish payloads if present
    if "payload" in column_list:
        column_formatters = {
            "payload": lambda m, a: _pretty_json(getattr(m, a)),
        }

    can_create = False
    can_edit = False
    can_delete = False


# Optional admin views if those tables exist in your project
if Verification is not None:
    class VerificationAdmin(ModelView, model=Verification):
        name = "Verification"
        name_plural = "Verifications"
        icon = "fa-solid fa-badge-check"
        page_size = 25

        column_list = [c.name for c in Verification.__table__.columns]
        column_details_list = column_list
        column_searchable_list = [x for x in ["doc_type", "status", "filename", "reviewer"] if x in column_list]
        column_sortable_list = [x for x in ["uploaded_at", "decided_at", "id"] if x in column_list]

        # Allow safe edits (status/notes), but not deletes
        can_create = False
        can_edit = True
        can_delete = False

if MetricsDaily is not None:
    class MetricsDailyAdmin(ModelView, model=MetricsDaily):
        name = "MetricsDaily"
        name_plural = "MetricsDaily"
        icon = "fa-solid fa-chart-line"
        page_size = 50

        column_list = [c.name for c in MetricsDaily.__table__.columns]
        column_details_list = column_list
        column_searchable_list = []
        column_sortable_list = [x for x in ["date", "cti_score", "id"] if x in column_list]

        # Pretty JSON for cti_components
        if "cti_components" in column_list:
            column_formatters = {
                "cti_components": lambda m, a: _pretty_json(getattr(m, a)),
            }

        can_create = False
        can_edit = False
        can_delete = False


# ---------- Public hook ----------

def attach_admin(app: FastAPI) -> None:
    """
    Mounts the SQLAdmin UI at /admin using your existing SQLAlchemy engine.
    Call this once from main.py after you create `app`.
    """
    admin = Admin(app, engine)

    admin.add_view(EntityAdmin)
    admin.add_view(EventAdmin)

    if Verification is not None:
        admin.add_view(VerificationAdmin)
    if MetricsDaily is not None:
        admin.add_view(MetricsDailyAdmin)


# admin.py

# ... keep the rest ...

if Verification is not None:
    class VerificationAdmin(ModelView, model=Verification):
        name = "Verification"
        name_plural = "Verifications"
        icon = "fa-solid fa-badge-check"
        page_size = 25

        # Show a sane set of columns
        column_list = [c.name for c in Verification.__table__.columns
                       if c.name in ("id","entity_id","doc_type","filename","status","uploaded_at","decided_at")]
        column_details_list = [c.name for c in Verification.__table__.columns]

        column_searchable_list = [x for x in ["doc_type","status","filename","reviewer","entity_id"] if x in [c.name for c in Verification.__table__.columns]]
        column_sortable_list = [x for x in ["uploaded_at","decided_at","id","entity_id","status"] if x in [c.name for c in Verification.__table__.columns]]

        # Turn the filename into a "View" button that opens the file route in a new tab
        column_labels = {"filename": "Filename / View"}
        column_formatters = {
            "filename": lambda m, a: Markup(
                f'<a class="btn btn-sm btn-primary" '
                f'href="/verifications/{m.id}/file" target="_blank" rel="noopener">'
                f'View</a>&nbsp;<span class="text-muted">{getattr(m, a) or ""}</span>'
            ),
            # Optional: prettier status pill
            "status":   lambda m, a: Markup(
                f'<span class="badge" style="background:#f6f7fb;border:1px solid #e6e8f2;'
                f'border-radius:999px;padding:4px 10px;">{getattr(m, a)}</span>'
            ),
        }

        can_create = False
        can_edit = True   # allow notes/status edits if you want
        can_delete = False
