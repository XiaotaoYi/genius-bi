from src.langgraph.text2insight.chat_query_parsing_state import ChatQueryParsingState
from src.utils.spacy_util import spacy_util
def execute_semantic_mapping(state: ChatQueryParsingState) -> ChatQueryParsingState:
    matched_elements =  spacy_util.prefix_match_words(state['query'])
    from src.dataprovider.mysql.mysql_db import execute_sql_ext
    sql = '''
    select concat('_',dimension_id ,'_', 'dimension') as nature_suffix from dataset_dimension_tbl where dataset_id  = :dataset_id
    union
    select concat('_',metric_id ,'_', 'metric') as nature_suffix from dataset_metric_tbl where dataset_id  = :dataset_id
    '''
    results = execute_sql_ext(sql, {"dataset_id": state['dataset_id']})
    swapped_dict = {item['nature_suffix']: 'nature_suffix' for item in results}
    mapping_info = {}
    for element in matched_elements:
        s = element[1]
        first_index = s.find('_') + 1  # Position after the first underscore
        second_index = s.find('_', first_index)  # Find second underscore starting from after the first one
        result = s[second_index:] if second_index != -1 else s
        if result in swapped_dict:
            if element[2] >= 0.9:
                mapping_info[element[0]] = element[1]
    state['mapping_info'] = mapping_info
    
    return {
            **state,
            "current_phase": "parsing"
        }