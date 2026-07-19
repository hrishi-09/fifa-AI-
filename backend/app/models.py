from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)  # fan | volunteer | organizer | security
    country = Column(String, default="")
    language = Column(String, default="en")
    accessibility_need = Column(String, default="")


class Zone(Base):
    __tablename__ = "zones"
    id = Column(String, primary_key=True)  # e.g. "A".."H"
    name = Column(String, nullable=False)
    capacity = Column(Integer, default=5000)
    current_people = Column(Integer, default=1000)
    occupancy_pct = Column(Float, default=20.0)
    risk_level = Column(String, default="low")  # low | moderate | critical
    cx = Column(Float, default=0)  # map coordinates
    cy = Column(Float, default=0)


class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(String, ForeignKey("zones.id"), nullable=True)
    message = Column(String, nullable=False)
    severity = Column(String, default="info")  # info | ok | warn | bad
    status = Column(String, default="open")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Incident(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True)
    zone_id = Column(String, ForeignKey("zones.id"), nullable=True)
    description = Column(String, nullable=False)
    severity = Column(String, default="warn")  # ok | warn | bad
    status = Column(String, default="monitoring")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Volunteer(Base):
    __tablename__ = "volunteers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    assigned_zone = Column(String, ForeignKey("zones.id"), nullable=True)
    available = Column(Boolean, default=True)


class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    volunteer_id = Column(Integer, ForeignKey("volunteers.id"), nullable=True)
    title = Column(String, nullable=False)
    zone_id = Column(String, ForeignKey("zones.id"), nullable=True)
    done = Column(Boolean, default=False)


class WasteBin(Base):
    __tablename__ = "waste_bins"
    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, nullable=False)
    fill_level = Column(Float, default=10.0)


class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, default="fan")
    prompt = Column(String, nullable=False)
    response = Column(String, nullable=False)
    language = Column(String, default="en")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
