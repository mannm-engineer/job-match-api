from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import SessionLocal, init_db, Job, Task
from app.config import MAX_RESULTS_PER_RUN
import subprocess
from app.schemas import TaskCreate, TaskRead

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

# --- Tasks API ---
@app.post('/tasks', response_model=TaskRead)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    task = Task(title=payload.title, description=payload.description or "", priority=payload.priority, assignee=payload.assignee)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@app.get('/tasks')
def list_tasks(limit: int = 100, db: Session = Depends(get_db)):
    q = db.query(Task).order_by(Task.created_at.desc()).limit(limit).all()
    return {"count": len(q), "results": q}

@app.post('/tasks/{task_id}/status')
def update_task_status(task_id: int, status: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.status = status
    db.commit()
    db.refresh(task)
    return {"status": "ok", "task": task}
