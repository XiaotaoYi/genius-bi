from src.langgraph.text2insight.chat_query_parsing_state import ChatQueryParsingState
def execute_result_analysis(state: ChatQueryParsingState) -> ChatQueryParsingState:
    return {
            **state,
            "current_phase": "end"
        }