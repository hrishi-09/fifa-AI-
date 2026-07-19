import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from .database import SessionLocal, engine, Base
from . import models, ai_agents, seed
from .routers import zones, alerts, incidents, tasks, chat
from .ws import manager

Base.metadata.create_all(bind=engine)
seed.run()

app = FastAPI(title="FIFA AI StadiumOS API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(zones.router)
app.include_router(alerts.router)
app.include_router(incidents.router)
app.include_router(tasks.router)
app.include_router(chat.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "FIFA AI StadiumOS"}


@app.websocket("/ws/live")
async def live_feed(ws: WebSocket):
    """Pushes crowd + waste bin updates every few seconds, the same data the
    background simulation loop below is generating, so every connected
    dashboard stays in sync in real time."""
    await manager.connect(ws)
    try:
        while True:
            await ws.receive_text()  # keep-alive / ignore inbound pings
    except WebSocketDisconnect:
        manager.disconnect(ws)


async def simulation_loop():
    """Background task standing in for live stadium sensor + weather + traffic feeds.
    Steps zone occupancy and waste bin levels, then broadcasts the new state
    to every connected dashboard over the WebSocket."""
    while True:
        await asyncio.sleep(4)
        db = SessionLocal()
        try:
            zones_ = db.query(models.Zone).all()
            for z in zones_:
                ai_agents.step_zone_occupancy(z)

            bins_ = db.query(models.WasteBin).all()
            for b in bins_:
                ai_agents.step_waste_bin(b)

            db.commit()

            payload = {
                "type": "tick",
                "zones": [
                    {
                        "id": z.id, "name": z.name, "occupancy_pct": round(z.occupancy_pct, 1),
                        "risk_level": z.risk_level, "cx": z.cx, "cy": z.cy,
                    } for z in zones_
                ],
                "waste_bins": [
                    {"id": b.id, "location": b.location, "fill_level": round(b.fill_level, 1)}
                    for b in bins_
                ],
            }
            await manager.broadcast(payload)
        finally:
            db.close()


@app.on_event("startup")
async def on_startup():
    asyncio.create_task(simulation_loop())
