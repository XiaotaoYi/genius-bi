from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models import ModelMetric as ModelMetricModel
from schemas import ModelMetric as ModelMetricSchema
from schemas import ModelMetricCreate, ModelMetricUpdate
from database import get_db

router = APIRouter()

@router.post("/metrics/", response_model=ModelMetricSchema)
def create_metric(metric: ModelMetricCreate, db: Session = Depends(get_db)):
    db_metric = ModelMetricModel(**metric.model_dump())
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric

@router.get("/metrics/")
def read_metrics(page: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Calculate skip based on page number and limit
    skip = (page - 1) * limit

    # Get the total number of terms
    total_terms = db.query(ModelMetricModel).count()

    # Get the terms for the current page
    terms = db.query(ModelMetricModel).offset(skip).limit(limit).all()

    # Calculate total pages
    total_pages = (total_terms + limit - 1) // limit if total_terms > 0 else 1

    return {
        "items": terms,
        "pages": total_pages,
        "page": page
    }

@router.get("/metrics/{metric_id}")
def read_metric(metric_id: int, db: Session = Depends(get_db)):
    metric = db.query(ModelMetricModel).filter(ModelMetricModel.id == metric_id).first()
    if metric is None:
        raise HTTPException(status_code=404, detail="Metric not found")
    return {"data":metric}

@router.put("/metrics/{metric_id}", response_model=ModelMetricSchema)
def update_metric(metric_id: int, metric: ModelMetricUpdate, db: Session = Depends(get_db)):
    db_metric = db.query(ModelMetricModel).filter(ModelMetricModel.id == metric_id).first()
    if db_metric is None:
        raise HTTPException(status_code=404, detail="Metric not found")
    for var, value in vars(metric).items():
        setattr(db_metric, var, value)
    db.commit()
    db.refresh(db_metric)
    return db_metric

@router.delete("/metrics/{metric_id}", response_model=ModelMetricSchema)
def delete_metric(metric_id: int, db: Session = Depends(get_db)):
    db_metric = db.query(ModelMetricModel).filter(ModelMetricModel.id == metric_id).first()
    if db_metric is None:
        raise HTTPException(status_code=404, detail="Metric not found")
    db.delete(db_metric)
    db.commit()
    return db_metric 