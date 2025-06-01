from sqlalchemy import Column, Integer, String, TIMESTAMP, Float, SmallInteger, BigInteger
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class Term(Base):
    __tablename__ = 'term_tbl'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    synonym = Column(String(50))
    description = Column(String(255))
    create_by = Column(String(50))
    create_time = Column(TIMESTAMP, server_default=func.now())
    update_by = Column(String(50))
    update_time = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class LLM(Base):
    __tablename__ = 'llm_tbl'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    connection_name = Column(String(50), nullable=False)
    api_protocal = Column(String(50), nullable=False)
    base_url = Column(String(255))
    api_key = Column(String(255))
    model_name = Column(String(255))
    api_version = Column(String(50))
    temperature = Column(Float)
    timeout = Column(Integer) # Assuming INT UNSIGNED in SQL maps to Integer in SQLAlchemy
    description = Column(String(255))
    create_by = Column(String(50))
    create_time = Column(TIMESTAMP, server_default=func.now())
    update_by = Column(String(50))
    update_time = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class Database(Base):
    __tablename__ = 'database_tbl'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    type = Column(String(50))
    jdbc_str = Column(String(255))
    version = Column(String(50))
    user = Column(String(255))
    password = Column(String(50))
    description = Column(String(255))
    create_by = Column(String(50))
    create_time = Column(TIMESTAMP, server_default=func.now())
    update_by = Column(String(50))
    update_time = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class Model(Base):
    __tablename__ = 'model_tbl'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    database_id = Column(BigInteger, nullable=False)
    database_name = Column(String(50))
    table_name = Column(String(255))
    model_name = Column(String(50))
    description = Column(String(255))
    create_by = Column(String(50))
    create_time = Column(TIMESTAMP, server_default=func.now())
    update_by = Column(String(50))
    update_time = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class ModelDimension(Base):
    __tablename__ = 'model_dimension_tbl'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    model_id = Column(BigInteger, nullable=False)
    name = Column(String(50), nullable=False)
    alias = Column(String(50))
    dimension_type = Column(SmallInteger) # Assuming tinyint maps to SmallInteger
    description = Column(String(50))
    express = Column(String(255))
    create_by = Column(String(50))
    create_time = Column(TIMESTAMP, server_default=func.now())
    update_by = Column(String(50))
    update_time = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class ModelMetric(Base):
    __tablename__ = 'model_metric_tbl'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    model_id = Column(BigInteger, nullable=False)
    name = Column(String(50), nullable=False)
    alias = Column(String(50))
    metric_type = Column(SmallInteger) # Assuming tinyint maps to SmallInteger
    description = Column(String(255))
    express = Column(String(255))
    create_by = Column(String(50))
    create_time = Column(TIMESTAMP, server_default=func.now())
    update_by = Column(String(50))
    update_time = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class Dataset(Base):
    __tablename__ = 'dataset_tbl'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    description = Column(String(255))
    create_by = Column(String(50))
    create_time = Column(TIMESTAMP, server_default=func.now())
    update_by = Column(String(50))
    update_time = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class DatasetMetric(Base):
    __tablename__ = 'dataset_metric_tbl'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    dataset_id = Column(BigInteger, nullable=False)
    metric_id = Column(BigInteger, nullable=False)
    create_by = Column(String(50))
    create_time = Column(TIMESTAMP, server_default=func.now())
    update_by = Column(String(50))
    update_time = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class DatasetDimension(Base):
    __tablename__ = 'dataset_dimension_tbl'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    dataset_id = Column(BigInteger, nullable=False)
    dimension_id = Column(BigInteger, nullable=False)
    create_by = Column(String(50))
    create_time = Column(TIMESTAMP, server_default=func.now())
    update_by = Column(String(50))
    update_time = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())


class AnalysisAssistant(Base):
    __tablename__ = 'analysis_assistant_tbl'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    description = Column(String(255))
    create_by = Column(String(50))
    create_time = Column(TIMESTAMP, server_default=func.now())
    update_by = Column(String(50))
    update_time = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class AnalysisAssistantDataset(Base):
    __tablename__ = 'analysis_assistant_dataset_tbl'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    analysis_assistant_id = Column(BigInteger, nullable=False)
    dataset_id = Column(BigInteger, nullable=False)
    create_by = Column(String(50))
    create_time = Column(TIMESTAMP, server_default=func.now())
    update_by = Column(String(50))
    update_time = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now()) 