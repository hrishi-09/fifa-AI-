import random
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from .. import models, schemas, ai_agents
from ..database import get_db

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


@router.get("/", response_model=List[schemas.IncidentOut])
def list_incidents(db: Session = Depends(get_db)):
    return db.query(models.Incident).order_by(desc(models.Incident.created_at)).limit(20).all()


@router.post("/", response_model=schemas.IncidentOut)
def create_incident(payload: schemas.IncidentCreate, db: Session = Depends(get_db)):
    code = f"INC-{random.randint(2300, 2399)}"
    incident = models.Incident(
        code=code,
        zone_id=payload.zone_id,
        description=payload.description,
        severity=payload.severity,
        status="monitoring",
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident


@router.get("/{incident_id}/response-plan")
def response_plan(incident_id: int, db: Session = Depends(get_db)):
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident:
        return {"error": "not found"}
    return {"plan": ai_agents.build_response_plan(incident.zone_id, incident.description)}
