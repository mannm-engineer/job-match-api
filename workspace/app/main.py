from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.db import SessionLocal, init_db, Job
from app.config import MAX_RESULTS_PER_RUN
import subprocess

app = FastAPI()

# Simple dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def startup():
    init_db()

@app.get('/health')
def health():
    return {"status": "ok"}

@app.post('/run-now')
def run_now():
    # Trigger scraper as a separate process
    # In k8s CronJob mode, scraping runs in its own pod; this endpoint spawns the script for ad-hoc runs
    subprocess.Popen(["python", "app/scraper.py"])
    return {"status": "started"}

@app.get('/jobs')
def list_jobs(limit: int = 20, db: Session = Depends(get_db)):
    query = db.query(Job).order_by(Job.created_at.desc()).limit(limit)
    results = []
    for j in query:
        results.append({
            "job_id": j.job_id,
            "title": j.title,
            "company": j.company,
            "location": j.location,
            "url": j.url,
            "posted_at": j.posted_at,
            "created_at": j.created_at.isoformat() if j.created_at else None
        })
    return {"count": len(results), "results": results}
