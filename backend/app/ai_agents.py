"""
AI Processing Layer
--------------------
Lightweight rule-based agents that stand in for LLM calls (OpenAI / Gemini / Claude).
Swap `call_llm()` for a real Anthropic/OpenAI API call to upgrade any agent to a true
LLM-backed agent without changing the router code that calls it.
"""
import random
from typing import Optional
from sqlalchemy.orm import Session
from . import models


def call_llm(system_prompt: str, user_prompt: str) -> str:
    """
    Placeholder for a real LLM call, e.g.:

        import anthropic
        client = anthropic.Anthropic()
        msg = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=300,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        return msg.content[0].text

    Kept rule-based here so the project runs with zero API keys.
    """
    raise NotImplementedError("Wire this up to a real LLM provider when you have an API key.")


# ---------------------------------------------------------------------------
# Crowd Prediction Agent
# ---------------------------------------------------------------------------
def risk_level_for(occupancy_pct: float) -> str:
    if occupancy_pct > 85:
        return "critical"
    if occupancy_pct >= 60:
        return "moderate"
    return "low"


def step_zone_occupancy(zone: models.Zone) -> None:
    """Simulates live sensor drift; a real deployment would ingest actual sensor feeds here."""
    delta = random.uniform(-4, 4)
    zone.occupancy_pct = max(5.0, min(98.0, zone.occupancy_pct + delta))
    zone.current_people = int(zone.capacity * (zone.occupancy_pct / 100))
    zone.risk_level = risk_level_for(zone.occupancy_pct)


# ---------------------------------------------------------------------------
# Navigation Agent
# ---------------------------------------------------------------------------
def recommend_gate(db: Session) -> models.Zone:
    zones = db.query(models.Zone).all()
    return min(zones, key=lambda z: z.occupancy_pct)


# ---------------------------------------------------------------------------
# Volunteer / Fan Assistant Agent (rule-based NLU)
# ---------------------------------------------------------------------------
INTENT_BANK = [
    (["gate", "entrance", "entry"],
     "The lowest-congestion entrance right now is Gate {gate} at {occ:.0f}% capacity. "
     "I've routed you there via the shortest concourse path."),
    (["queue", "wait", "busy", "line", "crowd"],
     "Gate {gate} currently has the shortest queue at {occ:.0f}% occupancy. "
     "Avoid Gate B if you can - it's trending toward congestion."),
    (["wheelchair", "accessib", "disab", "ramp"],
     "Accessible route activated: level-access ramp near Gate D, dedicated lift at Level 2, "
     "no stairs or escalators on the path."),
    (["toilet", "restroom", "bathroom", "wc"],
     "Nearest restroom is just past Section 212, on the left before the concession stand. "
     "Current wait is under 2 minutes."),
    (["food", "eat", "concession", "drink"],
     "The North Concourse food stalls are running about 60% less congested than the ones near Gate B."),
    (["transport", "leave", "metro", "bus", "uber", "taxi", "parking"],
     "Metro Line 3 will be fastest for the first 20 minutes after the final whistle, "
     "then shuttle buses become the better option as the platform fills."),
    (["emergency", "medical", "hurt", "help", "first aid"],
     "Flagged as priority. Nearest first aid station is 90m away and a steward has been dispatched."),
    (["language", "translate"],
     "I can respond in Spanish, Portuguese, French, Arabic, and Hindi - just ask in your language."),
]

FALLBACKS = [
    "Cross-checking live sensor and crowd data now - conditions are stable across most zones.",
    "Logged. For the fastest experience right now, the lowest-occupancy gates are your best bet.",
    "Here's what I'm seeing in real time: no major disruptions, one zone trending toward congestion.",
]


def assistant_reply(db: Session, prompt: str) -> str:
    q = prompt.lower()
    best_zone = recommend_gate(db)
    for keywords, template in INTENT_BANK:
        if any(k in q for k in keywords):
            return template.format(gate=best_zone.id, occ=best_zone.occupancy_pct)
    return random.choice(FALLBACKS)


# ---------------------------------------------------------------------------
# Emergency Agent
# ---------------------------------------------------------------------------
def build_response_plan(zone_id: Optional[str], description: str) -> str:
    return (
        f"Incident logged near Zone {zone_id or 'unknown'}. "
        "Nearest medical team dispatched, ETA ~2 minutes. "
        "Recommended evacuation lane: nearest exit ramp toward the outer concourse. "
        "Auxiliary gate opened to relieve crowd pressure."
    )


# ---------------------------------------------------------------------------
# Sustainability Agent
# ---------------------------------------------------------------------------
def step_waste_bin(bin_: models.WasteBin) -> None:
    bin_.fill_level = max(2.0, min(99.0, bin_.fill_level + random.uniform(0.5, 3.5)))
