from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/zones", tags=["zones"])


@router.get("/", response_model=List[schemas.ZoneOut])
def list_zones(db: Session = Depends(get_db)):
    return db.query(models.Zone).all()


@router.get("/{zone_id}", response_model=schemas.ZoneOut)
def get_zone(zone_id: str, db: Session = Depends(get_db)):
    return db.query(models.Zone).filter(models.Zone.id == zone_id).first()
