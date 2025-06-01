from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models import Dataset as DatasetModel
from models import DatasetMetric as DatasetMetricModel
from models import DatasetDimension as DatasetDimensionModel
from schemas import Dataset as DatasetSchema
from schemas import DatasetCreate, DatasetUpdate
from database import get_db
from sqlalchemy.exc import SQLAlchemyError

router = APIRouter()

@router.post("/datasets/", response_model=DatasetSchema)
def create_dataset(dataset: DatasetCreate, db: Session = Depends(get_db)):
    try:
        # Create the model
        dataset_dict = dataset.model_dump(exclude={'fields'})
        db_model = DatasetModel(**dataset_dict)
        db.add(db_model)
        db.flush()  # This will get us the model ID without committing

        # Create dimensions
        for field in dataset.fields:
            if field.type == 'metric':
                metric_dict = {}
                metric_dict['dataset_id'] = db_model.id
                metric_dict['metric_id'] = field.field_id
                db_metric = DatasetMetricModel(**metric_dict)
                db.add(db_metric)
            else:
                dimension_dict = {}
                dimension_dict['dataset_id'] = db_model.id
                dimension_dict['dimension_id'] = field.field_id
                db_dimension = DatasetDimensionModel(**dimension_dict)
                db.add(db_dimension)
            
        db.commit()
        db.refresh(db_model)
        return db_model
    except SQLAlchemyError as e:
        db.rollback()  
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/datasets/")
def read_datasets(page: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Calculate skip based on page number and limit
    skip = (page - 1) * limit

    # Get the total number of terms
    total_terms = db.query(DatasetModel).count()

    # Get the terms for the current page
    terms = db.query(DatasetModel).offset(skip).limit(limit).all()

    # Calculate total pages
    total_pages = (total_terms + limit - 1) // limit if total_terms > 0 else 1

    return {
        "items": terms,
        "pages": total_pages,
        "page": page
    }

@router.get("/datasets/{dataset_id}", response_model=DatasetSchema)
def read_dataset(dataset_id: int, db: Session = Depends(get_db)):
    dataset = db.query(DatasetModel).filter(DatasetModel.id == dataset_id).first()
    if dataset is None:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset

@router.put("/datasets/{dataset_id}", response_model=DatasetSchema)
def update_dataset(dataset_id: int, dataset: DatasetUpdate, db: Session = Depends(get_db)):
    db_dataset = db.query(DatasetModel).filter(DatasetModel.id == dataset_id).first()
    if db_dataset is None:
        raise HTTPException(status_code=404, detail="Dataset not found")
    for var, value in vars(dataset).items():
        setattr(db_dataset, var, value)
    db.commit()
    db.refresh(db_dataset)
    return db_dataset

@router.delete("/datasets/{dataset_id}", response_model=DatasetSchema)
def delete_dataset(dataset_id: int, db: Session = Depends(get_db)):
    db_dataset = db.query(DatasetModel).filter(DatasetModel.id == dataset_id).first()
    if db_dataset is None:
        raise HTTPException(status_code=404, detail="Dataset not found")
    db.delete(db_dataset)
    db.commit()
    return db_dataset 