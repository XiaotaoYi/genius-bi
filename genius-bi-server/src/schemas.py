from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TermBase(BaseModel):
    name: str
    synonym: Optional[str] = None
    description: Optional[str] = None

class TermCreate(TermBase):
    pass

class TermUpdate(TermBase):
    pass

class Term(TermBase):
    id: int
    create_by: Optional[str] = None
    create_time: Optional[datetime] = None
    update_by: Optional[str] = None
    update_time: Optional[datetime] = None

    class Config:
        from_attributes = True

class LLMBase(BaseModel):
    connection_name: str
    api_protocal: str
    base_url: Optional[str] = None
    api_key: Optional[str] = None # Consider if this should be included in responses
    model_name: Optional[str] = None
    api_version: Optional[str] = None
    temperature: Optional[float] = None
    timeout: Optional[int] = None
    description: Optional[str] = None

class LLMCreate(LLMBase):
    pass

class LLMUpdate(LLMBase):
    pass

class LLM(LLMBase):
    id: int
    create_by: Optional[str] = None
    create_time: Optional[datetime] = None
    update_by: Optional[str] = None
    update_time: Optional[datetime] = None

    class Config:
        from_attributes = True

class DatabaseBase(BaseModel):
    name: str
    type: Optional[str] = None
    jdbc_str: Optional[str] = None
    version: Optional[str] = None
    user: Optional[str] = None
    password: Optional[str] = None # Consider if this should be included in responses
    description: Optional[str] = None

class DatabaseCreate(DatabaseBase):
    pass

class DatabaseUpdate(DatabaseBase):
    pass

class Database(DatabaseBase):
    id: int
    create_by: Optional[str] = None
    create_time: Optional[datetime] = None
    update_by: Optional[str] = None
    update_time: Optional[datetime] = None

    class Config:
        from_attributes = True

class ModelBase(BaseModel):
    database_id: int
    database_name: Optional[str] = None
    table_name: Optional[str] = None
    model_name: Optional[str] = None
    description: Optional[str] = None

from pydantic import BaseModel
from typing import List, Any
# Define the response model for a single field
class TableField(BaseModel):
    name: str
    type: str
    # Add other potential metadata fields here if needed, based on what the frontend expects
    # e.elastic_type, etc.
    semantic_type: str | None = None
    extended_config: str | None = None
    alias: str | None = None

class ModelCreate(ModelBase):
    fields: list[TableField]

class ModelUpdate(ModelBase):
    pass

class Model(ModelBase):
    id: int
    create_by: Optional[str] = None
    create_time: Optional[datetime] = None
    update_by: Optional[str] = None
    update_time: Optional[datetime] = None

    class Config:
        from_attributes = True

class ModelDimensionBase(BaseModel):
    model_id: int
    name: str
    alias: Optional[str] = None
    dimension_type: Optional[str] = None # Assuming tinyint maps to int
    description: Optional[str] = None
    express: Optional[str] = None

class ModelDimensionCreate(ModelDimensionBase):
    pass

class ModelDimensionUpdate(ModelDimensionBase):
    id: int

class ModelDimension(ModelDimensionBase):
    id: int
    create_by: Optional[str] = None
    create_time: Optional[datetime] = None
    update_by: Optional[str] = None
    update_time: Optional[datetime] = None

    class Config:
        from_attributes = True

class ModelMetricBase(BaseModel):
    model_id: int
    name: str
    alias: Optional[str] = None
    metric_type: Optional[str] = None # Assuming tinyint maps to int
    description: Optional[str] = None
    express: Optional[str] = None

class ModelMetricCreate(ModelMetricBase):
    pass

class ModelMetricUpdate(ModelMetricBase):
    id: int

class ModelMetric(ModelMetricBase):
    id: int
    create_by: Optional[str] = None
    create_time: Optional[datetime] = None
    update_by: Optional[str] = None
    update_time: Optional[datetime] = None

    class Config:
        from_attributes = True

class DatasetBase(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None

class SelectedField(BaseModel):
    field_id: int
    alias: str
    type: str

class DatasetCreate(DatasetBase):
    fields: Optional[List[SelectedField]]

class DatasetUpdate(DatasetBase):
    pass

class Dataset(DatasetBase):
    id: int
    create_by: Optional[str] = None
    create_time: Optional[datetime] = None
    update_by: Optional[str] = None
    update_time: Optional[datetime] = None

    class Config:
        from_attributes = True

class DatasetFieldBase(BaseModel):
    field_id: int
    field_type: Optional[int] = None # Assuming tinyint maps to int

class DatasetFieldCreate(DatasetFieldBase):
    pass

class DatasetFieldUpdate(DatasetFieldBase):
    pass

class DatasetField(DatasetFieldBase):
    id: int
    create_by: Optional[str] = None
    create_time: Optional[datetime] = None
    update_by: Optional[str] = None
    update_time: Optional[datetime] = None

    class Config:
        from_attributes = True

class AnalysisAssistantBase(BaseModel):
    name: str
    description: Optional[str] = None

class AnalysisAssistantCreate(AnalysisAssistantBase):
    pass

class AnalysisAssistantUpdate(AnalysisAssistantBase):
    pass

class AnalysisAssistant(AnalysisAssistantBase):
    id: int
    create_by: Optional[str] = None
    create_time: Optional[datetime] = None
    update_by: Optional[str] = None
    update_time: Optional[datetime] = None

    class Config:
        from_attributes = True

class AnalysisAssistantDatasetBase(BaseModel):
    analysis_assistant_id: int
    dataset_id: int

class AnalysisAssistantDatasetCreate(AnalysisAssistantDatasetBase):
    pass

class AnalysisAssistantDatasetUpdate(AnalysisAssistantDatasetBase):
    pass

class AnalysisAssistantDataset(AnalysisAssistantDatasetBase):
    id: int
    create_by: Optional[str] = None
    create_time: Optional[datetime] = None
    update_by: Optional[str] = None
    update_time: Optional[datetime] = None

    class Config:
        from_attributes = True 