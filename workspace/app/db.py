from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, UniqueConstraint
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.sql import func
from app.config import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String, nullable=False)  # dedup key from LinkedIn
    title = Column(String)
    company = Column(String)
    location = Column(String)
    url = Column(String)
    posted_at = Column(String)
    raw = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (UniqueConstraint('job_id', name='uq_job_jobid'),)

def init_db():
    Base.metadata.create_all(bind=engine)
