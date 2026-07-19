from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("/", response_model=List[schemas.TaskOut])
def list_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()


@router.patch("/{task_id}", response_model=schemas.TaskOut)
def update_task(task_id: int, payload: schemas.TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    task.done = payload.done
    db.commit()
    db.refresh(task)
    return task
