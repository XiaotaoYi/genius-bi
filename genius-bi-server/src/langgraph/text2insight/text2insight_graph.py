from langgraph.graph import StateGraph, END, START
from src.langgraph.text2insight.chat_query_parsing_state import ChatQueryParsingState
from src.langgraph.text2insight.semantic_mapping_graph_node import execute_semantic_mapping
from src.langgraph.text2insight.sql_parsing_graph_node import execute_sql_parsing
from src.langgraph.text2insight.sql_correction_graph_node import execute_sql_correction
from src.langgraph.text2insight.semantic_transition_graph_node import execute_semantic_transition
from src.langgraph.text2insight.sql_execution_graph_node import execute_sql
from src.langgraph.text2insight.result_analysis_graph_node import execute_result_analysis

class Text2InsightGraph:
    def build_chat_query_parsing_graph(self) -> StateGraph:
        """create query parsing in chat scene"""

        workflow = StateGraph(ChatQueryParsingState)
        workflow.add_node('mapping', execute_semantic_mapping)
        workflow.add_node('parsing', execute_sql_parsing)
        workflow.add_node('correction', execute_sql_correction)
        workflow.add_node('transition', execute_semantic_transition)
        workflow.add_node('execution', execute_sql)
        workflow.add_node('result_analysis', execute_result_analysis)

        workflow.set_entry_point("mapping")

        workflow.add_edge('mapping', 'parsing')
        workflow.add_edge('parsing', 'correction')
        workflow.add_edge('correction', 'transition')
        workflow.add_edge('transition', 'execution')
        workflow.add_edge('execution', 'result_analysis')
        workflow.add_edge('result_analysis', END)

        return workflow.compile()
