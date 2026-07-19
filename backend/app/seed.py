from .database import SessionLocal, engine, Base
from . import models

ZONE_SEED = [
    ("A", "Gate A - North", 260, 34, 44),
    ("B", "Gate B - East", 470, 120, 88),
    ("C", "Gate C - South", 260, 306, 38),
    ("D", "Gate D - West", 50, 120, 57),
    ("E", "Gate E - NE", 400, 60, 63),
    ("F", "Gate F - SE", 400, 280, 29),
    ("G", "Gate G - SW", 120, 280, 71),
    ("H", "Gate H - NW", 120, 60, 33),
]

TASK_SEED = [
    ("Guide fans with mobility needs to accessible lift, Gate D", "D"),
    ("Restock hand sanitizer stations, Concourse North", "A"),
    ("Assist lost child reunification desk, Gate B", "B"),
    ("Direct overflow queue at Gate B to auxiliary lane", "B"),
]

WASTE_SEED = [
    ("Food Court North", 72),
    ("Food Court South", 88),
    ("Gate B Concourse", 54),
    ("Gate D Concourse", 41),
    ("Concourse East", 66),
]

ALERT_SEED = [
    (None, "Weather stable - no operational impact expected", "ok"),
    ("B", "Crowd density at Gate B exceeds 85% - AI recommends opening auxiliary lane", "bad"),
    ("B", "Forecast: Gate B congestion peak in ~18 minutes", "warn"),
]


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(models.Zone).count() == 0:
            for zid, name, cx, cy, occ in ZONE_SEED:
                db.add(models.Zone(
                    id=zid, name=name, capacity=5000,
                    current_people=int(5000 * occ / 100),
                    occupancy_pct=occ,
                    risk_level="critical" if occ > 85 else ("moderate" if occ >= 60 else "low"),
                    cx=cx, cy=cy,
                ))
        if db.query(models.Task).count() == 0:
            for title, zone in TASK_SEED:
                db.add(models.Task(title=title, zone_id=zone, done=False))
        if db.query(models.WasteBin).count() == 0:
            for loc, lvl in WASTE_SEED:
                db.add(models.WasteBin(location=loc, fill_level=lvl))
        if db.query(models.Alert).count() == 0:
            for zone, msg, sev in ALERT_SEED:
                db.add(models.Alert(zone_id=zone, message=msg, severity=sev))
        if db.query(models.Incident).count() == 0:
            db.add(models.Incident(
                code="INC-2291", zone_id="B",
                description="Crowd surge reported, Section 108",
                severity="bad", status="monitoring",
            ))
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    run()
    print("Seed complete.")
