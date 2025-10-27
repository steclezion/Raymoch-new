# db.py — SQLAlchemy models + session helpers (SQLite by default)
from __future__ import annotations

import os
from datetime import datetime
from typing import Generator

from sqlalchemy import (
    create_engine, Column, String, Float, Integer, DateTime, JSON, ForeignKey,
    CheckConstraint, Index, UniqueConstraint, event
)
from sqlalchemy.orm import declarative_base, sessionmaker, relationship, Session

# --- DB URL (SQLite default) ---
DB_URL = os.getenv("DB_URL", "sqlite:///./raymoch.db")

# For SQLite, need this extra arg; for Postgres/MySQL it’s ignored
connect_args = {"check_same_thread": False} if DB_URL.startswith("sqlite") else {}
engine = create_engine(DB_URL, connect_args=connect_args, future=True)

# Ensure SQLite enforces foreign keys (needed for ondelete=CASCADE)
@event.listens_for(engine, "connect")
def _set_sqlite_pragma(dbapi_conn, conn_record):
    try:
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()
    except Exception:
        # Non-SQLite backends will just no-op here
        pass

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Base = declarative_base()

# =========================
# MODELS
# =========================
class Entity(Base):
    __tablename__ = "entities"

    # Business ID (GEID or similar)
    id = Column(String(64), primary_key=True, index=True)

    # Optional business metadata
    name = Column(String(160), nullable=True)
    work_email = Column(String(255), nullable=True, index=True)

    # Lifecycle/status
    status = Column(String(16), nullable=False, default="pending", server_default="pending")

    # CTI-related metrics
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_verified = Column(DateTime, nullable=True)

    decay_points = Column(Integer, nullable=False, default=0)
    cti = Column(Float, nullable=False, default=0.0)
    tier = Column(String(32), nullable=False, default="Bronze")

    # Relations
    tokens = relationship("Token", back_populates="entity", cascade="all, delete-orphan", passive_deletes=True)
    events = relationship("Event", back_populates="entity", cascade="all, delete-orphan", passive_deletes=True)

    __table_args__ = (
        CheckConstraint("status in ('pending','verified','rejected')", name="ck_entity_status"),
        Index("ix_entities_status", "status"),
    )


class Token(Base):
    __tablename__ = "tokens"

    id = Column(String(64), primary_key=True)  # UUID or hash id
    entity_id = Column(String(64), ForeignKey("entities.id", ondelete="CASCADE"), index=True, nullable=False)

    token_type = Column(String(8), nullable=False)  # vt / at / ft
    status = Column(String(16), nullable=False, default="pending", server_default="pending")  # <-- required by code
    weight = Column(Float, nullable=False, default=0.0)
    confidence = Column(Float, nullable=False, default=0.0)
    digest = Column(String(128), nullable=True)     # sha256 hex (optional)
    meta = Column(JSON)                             # filename, content_type, path, etc.

    issued_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)

    entity = relationship("Entity", back_populates="tokens")

    __table_args__ = (
        CheckConstraint("status in ('pending','approved','rejected')", name="ck_token_status"),
        # Fast lookups for admin/CTI recompute paths
        Index("ix_tokens_entity_status_type", "entity_id", "status", "token_type"),
        # Idempotency guard per entity+digest
        UniqueConstraint("entity_id", "digest", name="uq_tokens_entity_digest"),
    )


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    entity_id = Column(String(64), ForeignKey("entities.id", ondelete="CASCADE"), index=True, nullable=False)

    ts = Column(DateTime, nullable=False, default=datetime.utcnow)
    msg = Column(String, nullable=False)

    entity = relationship("Entity", back_populates="events")


# =========================
# SESSION HELPERS
# =========================
def init_db() -> None:
    """Create tables if they don’t exist."""
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency: yields a session and ensures close."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
