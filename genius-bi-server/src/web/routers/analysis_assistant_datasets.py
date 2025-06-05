from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import select

from src.web.models import AnalysisAssistantDataset as AnalysisAssistantDatasetModel
from src.web.models import Dataset as DatasetModel
from src.web.schemas import AnalysisAssistantDataset as AnalysisAssistantDatasetSchema
from src.web.schemas import AnalysisAssistantDatasetCreate, AnalysisAssistantDatasetUpdate
from src.web.schemas import Dataset as DatasetSchema
from src.dataprovider.mysql.mysql_db import get_db

router = APIRouter()

@router.post("/analysis-assistant-datasets/", response_model=AnalysisAssistantDatasetSchema)
def create_analysis_assistant_dataset(assistant_dataset: AnalysisAssistantDatasetCreate, db: Session = Depends(get_db)):
    db_assistant_dataset = AnalysisAssistantDatasetModel(**assistant_dataset.model_dump())
    db.add(db_assistant_dataset)
    db.commit()
    db.refresh(db_assistant_dataset)
    return db_assistant_dataset

@router.get("/analysis-assistant-datasets/", response_model=List[AnalysisAssistantDatasetSchema])
def read_analysis_assistant_datasets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    assistant_datasets = db.query(AnalysisAssistantDatasetModel).offset(skip).limit(limit).all()
    return assistant_datasets

@router.get("/analysis-assistant-datasets/{assistant_dataset_id}", response_model=AnalysisAssistantDatasetSchema)
def read_analysis_assistant_dataset(assistant_dataset_id: int, db: Session = Depends(get_db)):
    assistant_dataset = db.query(AnalysisAssistantDatasetModel).filter(AnalysisAssistantDatasetModel.id == assistant_dataset_id).first()
    if assistant_dataset is None:
        raise HTTPException(status_code=404, detail="Analysis assistant dataset not found")
    return assistant_dataset

@router.put("/analysis-assistant-datasets/{assistant_dataset_id}", response_model=AnalysisAssistantDatasetSchema)
def update_analysis_assistant_dataset(assistant_dataset_id: int, assistant_dataset: AnalysisAssistantDatasetUpdate, db: Session = Depends(get_db)):
    db_assistant_dataset = db.query(AnalysisAssistantDatasetModel).filter(AnalysisAssistantDatasetModel.id == assistant_dataset_id).first()
    if db_assistant_dataset is None:
        raise HTTPException(status_code=404, detail="Analysis assistant dataset not found")
    for var, value in vars(assistant_dataset).items():
        setattr(db_assistant_dataset, var, value)
    db.commit()
    db.refresh(db_assistant_dataset)
    return db_assistant_dataset

@router.delete("/analysis-assistant-datasets/{assistant_dataset_id}", response_model=AnalysisAssistantDatasetSchema)
def delete_analysis_assistant_dataset(assistant_dataset_id: int, db: Session = Depends(get_db)):
    db_assistant_dataset = db.query(AnalysisAssistantDatasetModel).filter(AnalysisAssistantDatasetModel.dataset_id == assistant_dataset_id).first()
    if db_assistant_dataset is None:
        raise HTTPException(status_code=404, detail="Analysis assistant dataset not found")
    db.delete(db_assistant_dataset)
    db.commit()
    return db_assistant_dataset

@router.get("/analysis-assistants/{assistant_id}/datasets")
def read_assistant_datasets(assistant_id: int, page: int = 1, size: int = 10, db: Session = Depends(get_db)):
    # Calculate offset
    offset = (page - 1) * size
    
    # Query to get datasets associated with the assistant
    datasets = (
        db.query(DatasetModel)
        .join(
            AnalysisAssistantDatasetModel,
            DatasetModel.id == AnalysisAssistantDatasetModel.dataset_id
        )
        .filter(AnalysisAssistantDatasetModel.analysis_assistant_id == assistant_id)
        .offset(offset)
        .limit(size)
        .all()
    )
    
    return {
        "items": datasets
    }