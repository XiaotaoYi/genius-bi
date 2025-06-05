
from src.langgraph.text2insight.chat_query_parsing_state import ChatQueryParsingState
def execute_sql(state: ChatQueryParsingState) -> ChatQueryParsingState:
    return {
            **state,
            "current_phase": "result_analysis"
        }