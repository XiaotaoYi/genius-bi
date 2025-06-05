from typing import Dict, List, Any, Literal, TypedDict, Optional


class ChatQueryParsingState(TypedDict):
    """context used in parsing phrase for chat scene"""
    # input
    query: str # user question
    chat_id: str
    dataset_id: str
    dataset_name: str

    # processing state
    mapping_info: Dict[str, Any]  # map node output
    parsing_info: Dict[str, Any]  # parse node output
    correction_info: Dict[str, Any]  # correction node output
    transition_info: Dict[str, Any]  # transition node output

    # output
    result_info: Dict[str, Any]  # result

    # control flow
    current_phase: str
    error: Optional[str]