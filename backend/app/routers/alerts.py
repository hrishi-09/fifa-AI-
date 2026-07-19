from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("/", response_model=List[schemas.AlertOut])
def list_alerts(db: Session = Depends(get_db)):
    return db.query(models.Alert).order_by(desc(models.Alert.created_at)).limit(20).all()


@router.get("/waste", response_model=List[schemas.WasteBinOut])
def list_waste(db: Session = Depends(get_db)):
    return db.query(models.WasteBin).all()
