from typing import List
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active: List[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)

    def disconnect(self, ws: WebSocket):
        if ws in self.active:
            self.active.remove(ws)

    async def broadcast(self, data: dict):
        stale = []
        for ws in self.active:
            try:
                await ws.send_json(data)
            except Exception:
                stale.append(ws)
        for ws in stale:
            self.disconnect(ws)


manager = ConnectionManager()
