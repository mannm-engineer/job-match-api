from pydantic import BaseModel
from typing import Optional, List

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Optional[str] = "normal"
    assignee: Optional[str] = None

class TaskRead(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    assignee: Optional[str]
    created_at: Optional[str]

    class Config:
        orm_mode = True

class TaskList(BaseModel):
    count: int
    results: List[TaskRead]
