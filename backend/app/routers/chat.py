from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, ai_agents
from ..database import get_db

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/", response_model=schemas.ChatResponse)
def chat(payload: schemas.ChatRequest, db: Session = Depends(get_db)):
    reply = ai_agents.assistant_reply(db, payload.prompt)

    db.add(models.ChatHistory(
        role=payload.role,
        prompt=payload.prompt,
        response=reply,
        language=payload.language,
    ))
    db.commit()

    agent = "Volunteer AI Agent" if payload.role == "volunteer" else "Fan AI Assistant"
    return schemas.ChatResponse(response=reply, agent=agent)
