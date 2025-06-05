from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from src.web.models import ChatAssistant as ChatAssistantModel
from src.web.schemas import ChatAssistant as ChatAssistantSchema
from src.web.schemas import ChatAssistantQuery as ChatAssistantQuery
from src.web.schemas import ChatAssistantCreate, ChatAssistantUpdate
from src.dataprovider.mysql.mysql_db import get_db

router = APIRouter()

@router.post("/chat-assistants/", response_model=ChatAssistantSchema)
def create_chat_assistant(chat_assistant: ChatAssistantCreate, db: Session = Depends(get_db)):
    db_chat_assistant = ChatAssistantModel(**chat_assistant.model_dump())
    db.add(db_chat_assistant)
    db.commit()
    db.refresh(db_chat_assistant)
    return db_chat_assistant

@router.get("/chat-assistants/")
def read_chat_assistants(page: int = 1, size: int = 10, db: Session = Depends(get_db)):
    # Calculate offset
    offset = (page - 1) * size

    # Get total count
    total = db.query(ChatAssistantModel).count()

    # Get paginated items
    items = db.query(ChatAssistantModel).offset(offset).limit(size).all()

    # Calculate total pages
    total_pages = (total + size - 1) // size if total > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": total_pages
    } 

@router.post("/chat-assistants/parsing")
def create_chat_assistant(query: ChatAssistantQuery, db: Session = Depends(get_db)):
    from src.dataprovider.mysql.mysql_db import execute_sql_ext
    sql = '''
    select d.id as dataset_id, d.name as dataset_name
    from chat_assistant_tbl a
    join analysis_assistant_tbl b
      on a.analysis_assistant_id  = b.id
    join analysis_assistant_dataset_tbl c
      on a.analysis_assistant_id = c.analysis_assistant_id
    join dataset_tbl d
      on c.dataset_id = d.id
    where a.id = 1
    group by d.id, d.name
    '''
    results = execute_sql_ext(sql, {"chat_id": 1})

    from src.langgraph.text2insight.text2insight_graph import Text2InsightGraph
    text2InsightGraph = Text2InsightGraph()
    agent = text2InsightGraph.build_chat_query_parsing_graph()
    initial_state = {
        "query": query.query,
        "chat_id": query.chat_id,
        "dataset_id": results[0]['dataset_id'],
        "dataset_name": results[0]['dataset_name'],
        "mapping_info": None,
        "parsing_info": None,
        "correction_info": None,
        "transition_info": None,
        "result_info": None,
        "current_phase": "mapping",
        "error": None
    }
    print("LangGraph Mermaid流程图：")
    print(agent.get_graph().draw_mermaid())

    result = agent.invoke(initial_state)

    return result