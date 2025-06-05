from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy.exc import SQLAlchemyError

from src.web.models import Model as ModelModel
from src.web.models import ModelDimension as ModelDimensionModel
from src.web.models import ModelMetric as ModelMetricModel
from src.web.schemas import Model as ModelSchema
from src.web.schemas import ModelCreate, ModelUpdate, ModelDimensionCreate, ModelMetricCreate
from src.dataprovider.mysql.mysql_db import get_db

router = APIRouter()

def create_model_with_relations(model_data: ModelCreate, db: Session):
    try:
        # Create the model
        model_dict = model_data.model_dump(exclude={'dimensions', 'metrics', 'fields'})
        db_model = ModelModel(**model_dict)
        db.add(db_model)
        db.flush()  # This will get us the model ID without committing

        # Create dimensions
        for field in model_data.fields:
            if field.semantic_type == 'metric':
                metric_dict = {}
                metric_dict['model_id'] = db_model.id
                metric_dict['name'] = field.name
                metric_dict['alias'] = field.alias
                metric_dict['express'] = field.extended_config
                db_metric = ModelMetricModel(**metric_dict)
                db.add(db_metric)
            else:
                dimension_dict = {}
                dimension_dict['model_id'] = db_model.id
                dimension_dict['name'] = field.name
                dimension_dict['alias'] = field.alias
                dimension_dict['dimension_type'] = field.semantic_type
                dimension_dict['express'] = field.extended_config
                db_dimension = ModelDimensionModel(**dimension_dict)
                db.add(db_dimension)
            
        db.commit()
        db.refresh(db_model)
        return db_model
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/models/", response_model=ModelSchema)
def create_model(model: ModelCreate, db: Session = Depends(get_db)):
    return create_model_with_relations(model, db)

@router.get("/models/")
def read_models(page: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Calculate skip based on page number and limit
    skip = (page - 1) * limit

    # Get the total number of terms
    total_terms = db.query(ModelModel).count()

    # Get the terms for the current page
    terms = db.query(ModelModel).offset(skip).limit(limit).all()

    # Calculate total pages
    total_pages = (total_terms + limit - 1) // limit if total_terms > 0 else 1

    return {
        "items": terms,
        "pages": total_pages,
        "page": page
    }

@router.get("/models/{model_id}")
def read_model(model_id: int, db: Session = Depends(get_db)):
    model = db.query(ModelModel).filter(ModelModel.id == model_id).first()
    if model is None:
        raise HTTPException(status_code=404, detail="Model not found")
    return {"data":model}

@router.put("/models/{model_id}", response_model=ModelSchema)
def update_model(model_id: int, model: ModelUpdate, db: Session = Depends(get_db)):
    db_model = db.query(ModelModel).filter(ModelModel.id == model_id).first()
    if db_model is None:
        raise HTTPException(status_code=404, detail="Model not found")
    for var, value in vars(model).items():
        setattr(db_model, var, value)
    db.commit()
    db.refresh(db_model)
    return db_model

@router.delete("/models/{model_id}", response_model=ModelSchema)
def delete_model(model_id: int, db: Session = Depends(get_db)):
    db_model = db.query(ModelModel).filter(ModelModel.id == model_id).first()
    if db_model is None:
        raise HTTPException(status_code=404, detail="Model not found")
    db.delete(db_model)
    db.commit()
    return db_model

@router.get("/models/{model_id}/dimensions")
def get_model_dimensions(model_id: int, page: int = 1, limit: int = 100, db: Session = Depends(get_db)):
    # Verify model exists
    model = db.query(ModelModel).filter(ModelModel.id == model_id).first()
    if model is None:
        raise HTTPException(status_code=404, detail="Model not found")

    # Calculate skip based on page number and limit
    skip = (page - 1) * limit

    # Get the total number of dimensions for this model
    total_dimensions = db.query(ModelDimensionModel).filter(ModelDimensionModel.model_id == model_id).count()

    # Get the dimensions for the current page
    dimensions = db.query(ModelDimensionModel).filter(
        ModelDimensionModel.model_id == model_id
    ).offset(skip).limit(limit).all()

    # Calculate total pages
    total_pages = (total_dimensions + limit - 1) // limit if total_dimensions > 0 else 1

    return {
        "items": dimensions,
        "pages": total_pages,
        "page": page
    }

@router.get("/models/{model_id}/metrics")
def get_model_metrics(model_id: int, page: int = 1, limit: int = 100, db: Session = Depends(get_db)):
    # Verify model exists
    model = db.query(ModelModel).filter(ModelModel.id == model_id).first()
    if model is None:
        raise HTTPException(status_code=404, detail="Model not found")

    # Calculate skip based on page number and limit
    skip = (page - 1) * limit

    # Get the total number of metrics for this model
    total_metrics = db.query(ModelMetricModel).filter(ModelMetricModel.model_id == model_id).count()

    # Get the metrics for the current page
    metrics = db.query(ModelMetricModel).filter(
        ModelMetricModel.model_id == model_id
    ).offset(skip).limit(limit).all()

    # Calculate total pages
    total_pages = (total_metrics + limit - 1) // limit if total_metrics > 0 else 1

    return {
        "items": metrics,
        "pages": total_pages,
        "page": page
    }

@router.get("/models/{model_id}/fields")
def get_model_fields(model_id: int, db: Session = Depends(get_db)):
    # Step 1: Get model by model_id
    model = db.query(ModelModel).filter(ModelModel.id == model_id).first()
    if model is None:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # Step 2: Get dimensions with alias field
    dimensions = db.query(ModelDimensionModel).filter(
        ModelDimensionModel.model_id == model_id
    ).all()
    
    # Build dimension list with required fields
    dimension_list = [
        {
            "id": dim.id,
            "alias": dim.alias,
            "type": "dimension",
            "model_name": model.model_name
        }
        for dim in dimensions
    ]
    
    # Step 3: Get metrics with alias field
    metrics = db.query(ModelMetricModel).filter(
        ModelMetricModel.model_id == model_id
    ).all()
    
    # Build metric list with required fields
    metric_list = [
        {
            "id": metric.id,
            "alias": metric.alias,
            "type": "metric",
            "model_name": model.model_name
        }
        for metric in metrics
    ]
    
    # Step 4: Combine results
    combined_results = dimension_list + metric_list
    
    return {
        "data": combined_results,
        "total": len(combined_results)
    } 