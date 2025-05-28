import mysql.connector

def execute_mysql_query(sql_query):
    """
    Execute a SQL query on MySQL database and close connection immediately
    
    Parameters:
    config (dict): Database connection parameters 
                  (host, user, password, database)
    sql_query (str): SQL query to execute
    """
    connection = None
    try:
        # Establish database connection
        db_config = {
        "host": "localhost",
        "user": "root",
        "password": "1qazXSW@",
        "database": "order_analysis"
    }
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Execute the SQL query
        cursor.execute(sql_query)

        # Handle results if it's a SELECT query
        if cursor.with_rows:
            result = cursor.fetchall()
            print("Query executed successfully. Results:")
            for row in result:
                print(row)
        else:
            # Commit transaction for DML operations
            connection.commit()
            print(f"Query executed successfully. Rows affected: {cursor.rowcount}")

    except mysql.connector.Error as err:
        print(f"Database error occurred: {err}")
        # Rollback transaction in case of error
        if connection:
            connection.rollback()
    finally:
        # Close resources in reverse order of creation
        if 'cursor' in locals() and cursor is not None:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
            print("Database connection closed")

# Example usage
if __name__ == "__main__":
    
    sample_query = '''
    select name,concat('_',model_id,'_',id,'_','dimension') nature from s2_dimension where model_id = 16 or model_id = 17 or model_id = 18

    union 

    select name, concat('_',model_id,'_',id,'_','metric') nature from s2_metric where model_id = 16 or model_id = 17 or model_id = 18
    '''
    
    execute_mysql_query(sample_query)