from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models import ModelDimension as ModelDimensionModel
from schemas import ModelDimension as ModelDimensionSchema
from schemas import ModelDimensionCreate, ModelDimensionUpdate
from database import get_db

router = APIRouter()

@router.post("/dimensions/", response_model=ModelDimensionSchema)
def create_dimension(dimension: ModelDimensionCreate, db: Session = Depends(get_db)):
    db_dimension = ModelDimensionModel(**dimension.model_dump())
    db.add(db_dimension)
    db.commit()
    db.refresh(db_dimension)
    return db_dimension

@router.get("/dimensions/")
def read_dimensions(page: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Calculate skip based on page number and limit
    skip = (page - 1) * limit

    # Get the total number of terms
    total_terms = db.query(ModelDimensionModel).count()

    # Get the terms for the current page
    terms = db.query(ModelDimensionModel).offset(skip).limit(limit).all()

    # Calculate total pages
    total_pages = (total_terms + limit - 1) // limit if total_terms > 0 else 1

    return {
        "items": terms,
        "pages": total_pages,
        "page": page
    }

@router.get("/dimensions/{dimension_id}")
def read_dimension(dimension_id: int, db: Session = Depends(get_db)):
    dimension = db.query(ModelDimensionModel).filter(ModelDimensionModel.id == dimension_id).first()
    if dimension is None:
        raise HTTPException(status_code=404, detail="Dimension not found")
    return {"data":dimension}

@router.put("/dimensions/{id}", response_model=ModelDimensionSchema)
def update_dimension(id: int, dimension: ModelDimensionUpdate, db: Session = Depends(get_db)):
    db_dimension = db.query(ModelDimensionModel).filter(ModelDimensionModel.id == id).first()
    if db_dimension is None:
        raise HTTPException(status_code=404, detail="Dimension not found")
    for var, value in vars(dimension).items():
        setattr(db_dimension, var, value)
    db.commit()
    db.refresh(db_dimension)
    return db_dimension

@router.delete("/dimensions/{dimension_id}", response_model=ModelDimensionSchema)
def delete_dimension(dimension_id: int, db: Session = Depends(get_db)):
    db_dimension = db.query(ModelDimensionModel).filter(ModelDimensionModel.id == dimension_id).first()
    if db_dimension is None:
        raise HTTPException(status_code=404, detail="Dimension not found")
    db.delete(db_dimension)
    db.commit()
    return db_dimension 