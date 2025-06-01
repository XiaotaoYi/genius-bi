from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models import LLM as LLMModel
from schemas import LLM as LLMSchema
from schemas import LLMCreate, LLMUpdate
from database import get_db

router = APIRouter()

@router.post("/llms/", response_model=LLMSchema)
def create_llm(llm: LLMCreate, db: Session = Depends(get_db)):
    db_llm = LLMModel(**llm.model_dump())
    db.add(db_llm)
    db.commit()
    db.refresh(db_llm)
    return db_llm

@router.get("/llms/")
def read_llms(page: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Calculate skip based on page number and limit
    skip = (page - 1) * limit

    # Get the total number of terms
    total_llms = db.query(LLMModel).count()

    # Get the terms for the current page
    llms = db.query(LLMModel).offset(skip).limit(limit).all()

    # Calculate total pages
    total_pages = (total_llms + limit - 1) // limit if total_llms > 0 else 1

    return {
        "items": llms,
        "pages": total_pages,
        "page": page
    }

@router.get("/llms/{llm_id}")
def read_llm(llm_id: int, db: Session = Depends(get_db)):
    llm = db.query(LLMModel).filter(LLMModel.id == llm_id).first()
    if llm is None:
        raise HTTPException(status_code=404, detail="LLM not found")
    return {
        "data": llm
    }

@router.put("/llms/{llm_id}", response_model=LLMSchema)
def update_llm(llm_id: int, llm: LLMUpdate, db: Session = Depends(get_db)):
    db_llm = db.query(LLMModel).filter(LLMModel.id == llm_id).first()
    if db_llm is None:
        raise HTTPException(status_code=404, detail="LLM not found")
    for var, value in vars(llm).items():
        setattr(db_llm, var, value)
    db.commit()
    db.refresh(db_llm)
    return db_llm

@router.delete("/llms/{llm_id}", response_model=LLMSchema)
def delete_llm(llm_id: int, db: Session = Depends(get_db)):
    db_llm = db.query(LLMModel).filter(LLMModel.id == llm_id).first()
    if db_llm is None:
        raise HTTPException(status_code=404, detail="LLM not found")
    db.delete(db_llm)
    db.commit()
    return db_llm 