from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ZoneOut(BaseModel):
    id: str
    name: str
    capacity: int
    current_people: int
    occupancy_pct: float
    risk_level: str
    cx: float
    cy: float

    class Config:
        from_attributes = True


class AlertOut(BaseModel):
    id: int
    zone_id: Optional[str]
    message: str
    severity: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class IncidentOut(BaseModel):
    id: int
    code: str
    zone_id: Optional[str]
    description: str
    severity: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class IncidentCreate(BaseModel):
    description: str
    zone_id: Optional[str] = None
    severity: str = "warn"


class TaskOut(BaseModel):
    id: int
    title: str
    zone_id: Optional[str]
    done: bool

    class Config:
        from_attributes = True


class TaskUpdate(BaseModel):
    done: bool


class WasteBinOut(BaseModel):
    id: int
    location: str
    fill_level: float

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    prompt: str
    role: str = "fan"
    language: str = "en"


class ChatResponse(BaseModel):
    response: str
    agent: str
