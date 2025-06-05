from sqlalchemy import create_engine,text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import List, TypeVar, Generic, Type, Dict, Any

# Replace with your actual database URL
DATABASE_URL = "mysql+mysqlconnector://root:1qazXSW_@localhost:3306/genius_bi"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 

T = TypeVar('T')

def execute_sql(sql: str, params: Dict[str, Any], model_class: Type[T]) -> List[T]:
    """
    Execute a SQL query and return results as a list of model instances.
    
    Args:
        sql (str): The SQL query to execute
        params (Dict[str, Any]): Dictionary of parameters for the query
        model_class (Type[T]): The model class to instantiate results with
        
    Returns:
        List[T]: List of model instances
    """
    with SessionLocal() as session:
        result = session.execute(text(sql), params)
        # Convert each row to a dictionary using _asdict() method
        return [model_class(**row._asdict()) for row in result]

def execute_sql_ext(sql: str, params: Dict[str, Any]) -> List[any]:
    """
    Execute a SQL query and return results as a list of model instances.
    
    Args:
        sql (str): The SQL query to execute
        params (Dict[str, Any]): Dictionary of parameters for the query
        model_class (Type[T]): The model class to instantiate results with
        
    Returns:
        List[T]: List of model instances
    """
    with SessionLocal() as session:
        result = session.execute(text(sql), params)
        # Convert each row to a dictionary using _asdict() method
        ret = []
        [ret.append(row._asdict()) for row in result]
        return ret