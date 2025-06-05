
from src.langgraph.text2insight.chat_query_parsing_state import ChatQueryParsingState
from src.dataprovider.mysql.mysql_db import execute_sql_ext
def execute_semantic_transition(state: ChatQueryParsingState) -> ChatQueryParsingState:
    mapping_info = state['mapping_info']
    dimension_model_ids = []
    dimension_ids = []
    metric_ids = []
    for k, v in mapping_info.items():
        arr = str(v).split('_')
        if str(v).endswith('_dimension'):
            dimension_model_ids.append(arr[1])
            dimension_ids.append(arr[2])
        else:
            metric_ids.append(arr[2])
    metric_sql = f'''
    select t2.table_name  as table_name,t1.alias,t1.name as field_name,t1.metric_type,t1.express
    from model_metric_tbl t1
    join model_tbl t2
    on t1.model_id  = t2.id
    where t1.id in ({",".join([f"'{x}'" for x in metric_ids])})
    '''
    metrics = execute_sql_ext(metric_sql, None)

    dimension_sql = f'''
    select t2.table_name  as table_name,t1.alias,t1.name as field_name,t1.dimension_type ,t1.express
    from model_dimension_tbl t1
    join model_tbl t2
    on t1.model_id  = t2.id
    where t1.id in ({",".join([f"'{x}'" for x in dimension_ids])})
    '''
    dimensions = execute_sql_ext(dimension_sql, None)

    model_id_sql = f'''
    select t2.table_name as table_name,t1.name as field_name,t1.express
    from model_dimension_tbl t1
    join model_tbl t2
    on t1.model_id  = t2.id
    where t1.dimension_type = 'foreign key' and t1.model_id in ({",".join([f"'{x}'" for x in dimension_model_ids])})
    '''
    model_relations = execute_sql_ext(model_id_sql, None)    

    sql = state['correction_info']['sql']
    for item in metrics:
        sql = sql.replace('`'+item['alias']+'`', item['table_name'] + '.' + item['field_name'])
    for item in dimensions:
        sql = sql.replace('`'+item['alias']+'`', item['table_name'] + '.' + item['field_name'])
    
    dataset_replace_sql = ''
    for item in model_relations:
        if dataset_replace_sql == '':
            dataset_replace_sql = item['table_name'] + ' '
        if item['express'] != '':
            dataset_replace_sql = dataset_replace_sql + ' left join ' + item['express'].split('.')[0] + ' on ' + f'''{item['table_name']}.{item['field_name']} = {item['express']}'''
    sql = sql.replace(state['dataset_name'], dataset_replace_sql)

    state['transition_info'] = {}
    state['transition_info']['sql'] = sql

    return {
        **state,
        "current_phase": "execution"
    }