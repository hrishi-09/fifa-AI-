# FIFA AI StadiumOS

AI-powered smart stadium operations platform — one system, four dashboards
(Fan, Volunteer, Organizer, Security), backed by a multi-agent AI layer and
live real-time data over WebSockets.

This is a real, runnable full-stack project:

- **backend/** — FastAPI + SQLAlchemy (SQLite by default, Postgres-ready) +
  WebSocket live feed + a rule-based multi-agent AI layer
- **frontend/** — React + Vite + Tailwind, four role-based dashboards

A zero-dependency single-file demo (pure HTML/JS, no install required) is
also included at `standalone-demo.html` if you just want to open something
in a browser immediately.

---

## Quick start

### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

This will:
- create `stadiumos.db` (SQLite) on first run
- seed it with demo zones, tasks, alerts, an incident, and waste bins
- start a background simulation loop that steps crowd occupancy and waste
  levels every 4 seconds and broadcasts them over `ws://localhost:8000/ws/live`

Check it's alive: [http://localhost:8000/api/health](http://localhost:8000/api/health)
Interactive API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

To use Postgres instead of SQLite:

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/stadiumos"
```

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Vite dev server
proxies `/api` and `/ws` to the backend on port 8000, so both must be
running.

---

## Wiring in a real LLM

Every "AI Agent" (Navigation, Crowd Prediction, Emergency, Volunteer
Assistant) currently runs on rule-based logic in `backend/app/ai_agents.py`
so the project works with zero API keys. To upgrade the chat agent to a real
LLM:

1. `pip install anthropic` (or `openai`)
2. In `ai_agents.py`, implement `call_llm()` with a real API call
3. In `assistant_reply()`, call `call_llm()` instead of the keyword-matched
   `INTENT_BANK` lookup

The rest of the architecture (WebSocket broadcast, REST endpoints, React
dashboards) doesn't need to change.

---

## Project layout

```
backend/
  app/
    main.py          FastAPI app, WebSocket, background simulation loop
    database.py       SQLAlchemy engine/session (SQLite by default)
    models.py          Users, Zones, Alerts, Incidents, Volunteers, Tasks, WasteBins, ChatHistory
    schemas.py          Pydantic request/response models
    ai_agents.py        Rule-based AI agent layer (swap in a real LLM here)
    seed.py                Demo data seeding
    routers/
      zones.py, alerts.py, incidents.py, tasks.py, chat.py
  requirements.txt

frontend/
  src/
    App.jsx               Role routing + live WebSocket state
    api.js                  REST + WebSocket client
    components/
      TopBar.jsx, RoleTabs.jsx, StadiumMap.jsx, AIChat.jsx
      FanDashboard.jsx, VolunteerDashboard.jsx
      OrganizerDashboard.jsx, SecurityDashboard.jsx
  tailwind.config.js
  vite.config.js
```

---

## Notes

- Weather / traffic / real stadium sensors are simulated — swap the
  simulation loop in `main.py` for real API calls (weather, transit,
  IoT sensor ingestion) when you have live data sources.
- CORS is wide open (`allow_origins=["*"]`) for local development — lock
  this down to your real frontend origin before deploying.
