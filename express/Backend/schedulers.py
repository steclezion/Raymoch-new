# scheduler.py
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from datetime import datetime
from db import SessionLocal, Entity
from cti_engine import recompute_cti

def sweep():
    db: Session = SessionLocal()
    try:
        for ent in db.query(Entity).all():
            if not ent.last_verified:
                continue
            days = (datetime.utcnow() - ent.last_verified).days
            new_decay = min(days // 90, 10)
            if new_decay != (ent.decay_points or 0):
                ent.decay_points = new_decay
                db.commit()
                recompute_cti(db, ent.id)
    finally:
        db.close()

sched = BackgroundScheduler()
sched.add_job(sweep, "cron", hour=2, minute=0)  # daily 02:00

def start_scheduler():
    sched.start()
