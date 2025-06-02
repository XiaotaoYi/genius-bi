from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models import ChatAssistant as ChatAssistantModel
from schemas import ChatAssistant as ChatAssistantSchema
from schemas import ChatAssistantQuery as ChatAssistantQuery
from schemas import ChatAssistantCreate, ChatAssistantUpdate
from database import get_db

router = APIRouter()

@router.post("/chat-assistants/", response_model=ChatAssistantSchema)
def create_chat_assistant(chat_assistant: ChatAssistantCreate, db: Session = Depends(get_db)):
    db_chat_assistant = ChatAssistantModel(**chat_assistant.model_dump())
    db.add(db_chat_assistant)
    db.commit()
    db.refresh(db_chat_assistant)
    return db_chat_assistant

@router.get("/chat-assistants/")
def read_chat_assistants(page: int = 1, size: int = 10, db: Session = Depends(get_db)):
    # Calculate offset
    offset = (page - 1) * size

    # Get total count
    total = db.query(ChatAssistantModel).count()

    # Get paginated items
    items = db.query(ChatAssistantModel).offset(offset).limit(size).all()

    # Calculate total pages
    total_pages = (total + size - 1) // size if total > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": total_pages
    } 

@router.post("/chat-assistants/parsing")
def create_chat_assistant(query: ChatAssistantQuery, db: Session = Depends(get_db)):
    return {"data":"I'm 易沐鑫"}