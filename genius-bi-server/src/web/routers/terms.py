from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from src.web.models import Term as TermModel
from src.web.schemas import Term as TermSchema
from src.web.schemas import TermCreate, TermUpdate
from src.dataprovider.mysql.mysql_db import get_db

router = APIRouter()

@router.post("/terms/", response_model=TermSchema)
def create_term(term: TermCreate, db: Session = Depends(get_db)):
    db_term = TermModel(**term.model_dump())
    db.add(db_term)
    db.commit()
    db.refresh(db_term)
    return db_term

@router.get("/terms/", )
def read_terms(page: int = 1, limit: int = 10, db: Session = Depends(get_db)):
    # Calculate skip based on page number and limit
    skip = (page - 1) * limit

    # Get the total number of terms
    total_terms = db.query(TermModel).count()

    # Get the terms for the current page
    terms = db.query(TermModel).offset(skip).limit(limit).all()

    # Calculate total pages
    total_pages = (total_terms + limit - 1) // limit if total_terms > 0 else 1

    return {
        "items": terms,
        "pages": total_pages,
        "page": page
    }

@router.get("/terms/{term_id}")
def read_term(term_id: int, db: Session = Depends(get_db)):
    term = db.query(TermModel).filter(TermModel.id == term_id).first()
    if term is None:
        raise HTTPException(status_code=404, detail="Term not found")
    return {
        "data": term
    }

@router.put("/terms/{term_id}", response_model=TermSchema)
def update_term(term_id: int, term: TermUpdate, db: Session = Depends(get_db)):
    db_term = db.query(TermModel).filter(TermModel.id == term_id).first()
    if db_term is None:
        raise HTTPException(status_code=404, detail="Term not found")
    for var, value in vars(term).items():
        setattr(db_term, var, value)
    db.commit()
    db.refresh(db_term)
    return db_term

@router.delete("/terms/{term_id}", response_model=TermSchema)
def delete_term(term_id: int, db: Session = Depends(get_db)):
    db_term = db.query(TermModel).filter(TermModel.id == term_id).first()
    if db_term is None:
        raise HTTPException(status_code=404, detail="Term not found")
    db.delete(db_term)
    db.commit()
    return db_term 