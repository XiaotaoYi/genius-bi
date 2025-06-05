from src.dataprovider.mysql.mysql_db import execute_sql_ext
from sqlalchemy.orm import Session
from sqlalchemy import text

sql = '''
    select c.dataset_id
    from chat_assistant_tbl a
    join analysis_assistant_tbl b
      on a.analysis_assistant_id  = b.id
    join analysis_assistant_dataset_tbl c
      on a.analysis_assistant_id = c.analysis_assistant_id
    where a.id = :chat_id
    '''
results = execute_sql_ext(sql, {"chat_id": 1})
print(results)