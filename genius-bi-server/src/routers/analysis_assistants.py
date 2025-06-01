from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models import AnalysisAssistant as AnalysisAssistantModel
from schemas import AnalysisAssistant as AnalysisAssistantSchema
from schemas import AnalysisAssistantCreate, AnalysisAssistantUpdate
from database import get_db

router = APIRouter()

@router.post("/analysis-assistants/", response_model=AnalysisAssistantSchema)
def create_analysis_assistant(assistant: AnalysisAssistantCreate, db: Session = Depends(get_db)):
    db_assistant = AnalysisAssistantModel(**assistant.model_dump())
    db.add(db_assistant)
    db.commit()
    db.refresh(db_assistant)
    return db_assistant

@router.get("/analysis-assistants/", response_model=List[AnalysisAssistantSchema])
def read_analysis_assistants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    assistants = db.query(AnalysisAssistantModel).offset(skip).limit(limit).all()
    return assistants

@router.get("/analysis-assistants/{assistant_id}", response_model=AnalysisAssistantSchema)
def read_analysis_assistant(assistant_id: int, db: Session = Depends(get_db)):
    assistant = db.query(AnalysisAssistantModel).filter(AnalysisAssistantModel.id == assistant_id).first()
    if assistant is None:
        raise HTTPException(status_code=404, detail="Analysis assistant not found")
    return assistant

@router.put("/analysis-assistants/{assistant_id}", response_model=AnalysisAssistantSchema)
def update_analysis_assistant(assistant_id: int, assistant: AnalysisAssistantUpdate, db: Session = Depends(get_db)):
    db_assistant = db.query(AnalysisAssistantModel).filter(AnalysisAssistantModel.id == assistant_id).first()
    if db_assistant is None:
        raise HTTPException(status_code=404, detail="Analysis assistant not found")
    for var, value in vars(assistant).items():
        setattr(db_assistant, var, value)
    db.commit()
    db.refresh(db_assistant)
    return db_assistant

@router.delete("/analysis-assistants/{assistant_id}", response_model=AnalysisAssistantSchema)
def delete_analysis_assistant(assistant_id: int, db: Session = Depends(get_db)):
    db_assistant = db.query(AnalysisAssistantModel).filter(AnalysisAssistantModel.id == assistant_id).first()
    if db_assistant is None:
        raise HTTPException(status_code=404, detail="Analysis assistant not found")
    db.delete(db_assistant)
    db.commit()
    return db_assistant 