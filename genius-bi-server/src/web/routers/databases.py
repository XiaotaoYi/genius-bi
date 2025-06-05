import re
from fastapi import APIRouter, Depends, HTTPException
from fastapi.params import Query
from sqlalchemy.orm import Session
from typing import List
import mysql.connector
from urllib.parse import quote_plus

from src.web.models import Database as DatabaseModel
from src.web.schemas import Database as DatabaseSchema
from src.web.schemas import DatabaseCreate, DatabaseUpdate
from src.web.schemas import TableField
from src.dataprovider.mysql.mysql_db import get_db

router = APIRouter()

@router.post("/databases/", response_model=DatabaseSchema)
def create_database(database: DatabaseCreate, db: Session = Depends(get_db)):
    db_database = DatabaseModel(**database.model_dump())
    db.add(db_database)
    db.commit()
    db.refresh(db_database)
    return db_database

@router.get("/databases/")
def read_databases(page: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Calculate skip based on page number and limit
    skip = (page - 1) * limit

    # Get the total number of terms
    total_terms = db.query(DatabaseModel).count()

    # Get the terms for the current page
    terms = db.query(DatabaseModel).offset(skip).limit(limit).all()

    # Calculate total pages
    total_pages = (total_terms + limit - 1) // limit if total_terms > 0 else 1

    return {
        "items": terms,
        "pages": total_pages,
        "page": page
    }

@router.get("/databases/{database_id}")
def read_database(database_id: int, db: Session = Depends(get_db)):
    database = db.query(DatabaseModel).filter(DatabaseModel.id == database_id).first()
    if database is None:
        raise HTTPException(status_code=404, detail="Database not found")
    return {
        "data": database
    }

@router.put("/databases/{database_id}", response_model=DatabaseSchema)
def update_database(database_id: int, database: DatabaseUpdate, db: Session = Depends(get_db)):
    db_database = db.query(DatabaseModel).filter(DatabaseModel.id == database_id).first()
    if db_database is None:
        raise HTTPException(status_code=404, detail="Database not found")
    for var, value in vars(database).items():
        setattr(db_database, var, value)
    db.commit()
    db.refresh(db_database)
    return db_database

@router.delete("/databases/{database_id}", response_model=DatabaseSchema)
def delete_database(database_id: int, db: Session = Depends(get_db)):
    db_database = db.query(DatabaseModel).filter(DatabaseModel.id == database_id).first()
    if db_database is None:
        raise HTTPException(status_code=404, detail="Database not found")
    db.delete(db_database)
    db.commit()
    return db_database

@router.get("/databases/{database_id}/names")
def get_database_names(database_id: int, db: Session = Depends(get_db)):
    # Get database connection details
    database = db.query(DatabaseModel).filter(DatabaseModel.id == database_id).first()
    if database is None:
        raise HTTPException(status_code=404, detail="Database not found")
    
    try:
        # Parse JDBC string to get host and port
        jdbc_parts = database.jdbc_str.split('//')[1].split('/')[0].split(':')
        host = jdbc_parts[0]
        port = int(jdbc_parts[1]) if len(jdbc_parts) > 1 else 3306
        
        # Create connection
        conn = mysql.connector.connect(
            host=host,
            port=port,
            user=database.user,
            password=database.password
        )
        
        cursor = conn.cursor()
        cursor.execute("SHOW DATABASES")
        databases = [row[0] for row in cursor.fetchall()]
        
        # Filter out system databases
        system_dbs = ['information_schema', 'mysql', 'performance_schema', 'sys']
        databases = [db for db in databases if db not in system_dbs]
        
        cursor.close()
        conn.close()
        
        return databases
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get database names: {str(e)}")

@router.get("/databases/{database_id}/tables")
def get_table_names(database_id: int, database_name: str, db: Session = Depends(get_db)):
    # Get database connection details
    database = db.query(DatabaseModel).filter(DatabaseModel.id == database_id).first()
    if database is None:
        raise HTTPException(status_code=404, detail="Database not found")
    
    try:
        # Parse JDBC string to get host and port
        jdbc_parts = database.jdbc_str.split('//')[1].split('/')[0].split(':')
        host = jdbc_parts[0]
        port = int(jdbc_parts[1]) if len(jdbc_parts) > 1 else 3306
        
        # Create connection
        conn = mysql.connector.connect(
            host=host,
            port=port,
            user=database.user,
            password=database.password
        )
        
        cursor = conn.cursor()
        
        # Use the specified database
        cursor.execute(f"USE {database_name}")
        
        # Get table names
        cursor.execute("SHOW TABLES")
        tables = [row[0] for row in cursor.fetchall()]
        
        cursor.close()
        conn.close()
        
        return tables
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get table names: {str(e)}") 

@router.get("/databases/{db_connection_id}/tables/{table_name}/fields",
    response_model=List[TableField] # Specify the response model
)
def get_table_fields(
    db_connection_id: int,
    table_name: str,
    database_name: str = Query(..., alias="database_name"), # Use alias for query parameter
    db: Session = Depends(get_db) # Dependency to get SQLAlchemy session
):
    """
    Get schema information (fields) for a specific table in an external database.
    """
    # 1. Query the backend database for connection details
    db_connection = db.query(DatabaseModel).filter(DatabaseModel.id == db_connection_id).first()
    if not db_connection:
        raise HTTPException(status_code=404, detail="Database connection not found")

    # 2. Construct database connection string (Assuming MySQL and standard jdbc:mysql://host:port/db_name format)
    # You might need more robust parsing or different logic for other database types
    if db_connection.type.lower() != "mysql":
         raise HTTPException(status_code=400, detail=f"Database type {db_connection.type} not supported yet for field fetching")

    # Example parsing for jdbc:mysql://host:port/db_name?params
    jdbc_match = re.match(r"jdbc:mysql://([^:]+)(?::(\d+))?(?:/([^?]+))?", db_connection.jdbc_str)
    if not jdbc_match:
         raise HTTPException(status_code=500, detail=f"Could not parse JDBC string: {db_connection.jdbc_str}")

    host = jdbc_match.group(1)
    port = int(jdbc_match.group(2)) if jdbc_match.group(2) else 3306 # Default MySQL port
    # Note: The database_name from the JDBC string part is often the default DB,
    # but we use the database_name from the query parameter as requested.
    # jdbc_db = jdbc_match.group(3)

    conn = None
    cursor = None
    try:
        # 3. Establish a connection to the external database
        conn = mysql.connector.connect(
            host=host,
            port=port,
            database=database_name, # Use database_name from query parameter
            user=db_connection.user,
            password=db_connection.password,
            # Add other connection parameters if needed, like auth_plugin
        )
        cursor = conn.cursor()

        # 4. Query the table schema
        # This query fetches column names and types from the information_schema
        query = """
        SELECT COLUMN_NAME, DATA_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s
        ORDER BY ORDINAL_POSITION;
        """
        cursor.execute(query, (database_name, table_name))

        # 5. Build result data
        fields_info = []
        for (column_name, data_type) in cursor:
            fields_info.append(TableField(name=column_name, type=data_type)) # Initialize other fields to defaults/None

        return fields_info

    except mysql.connector.Error as err:
        # Handle potential database connection or query errors
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Exception as e:
        # Handle other potential errors
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
    finally:
        # Ensure connection and cursor are closed
        if cursor:
            cursor.close()
        if conn:
            conn.close()