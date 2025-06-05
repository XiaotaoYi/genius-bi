
from src.langgraph.text2insight.chat_query_parsing_state import ChatQueryParsingState
from datetime import datetime
from string import Template
from langchain.prompts import PromptTemplate
from langchain_community.llms import Tongyi
import os
from langchain_core.output_parsers import StrOutputParser

sql_correction_prompt_template = '''
#Role: You are a senior data engineer experienced in writing SQL languages.
#Task: You will be provided with a natural language query asked by users and corresponding sql provided by a junior data engineer,please review the sql and modify it if necessary. Be sure only return sql as a response when modify, don't use mark down format.
#Rules:
1.SQL columns and values must be mentioned in the `Schema`, DO NOT hallucinate.
2.ALWAYS specify time range using `>`,`<`,`>=`,`<=` operator.
3.DO NOT include time range in the where clause if not explicitly expressed in the `Query`.
4.DO NOT calculate date range using functions.
5.ALWAYS use `with` statement if nested aggregation is needed.
6.ALWAYS enclose alias declared by `AS` command in underscores.
7.Alias created by `AS` command must be in the same language ast the `Query`.
8.Modify provided sql if it has syntax error accoring to standard mysql syntax. Make sure double check syntax. It's important.
#Query: {query}
Schema: {schema}
ExtraInfo:CurrentDate=[{current_date}]
SQL: {sql}
'''
def execute_sql_correction(state: ChatQueryParsingState) -> ChatQueryParsingState:
    examples = ''
    query = state["query"]
    schema_template = Template('Table=[$table_name],PartitionTimeField=[$partitionTimeField],Metrics=[$metrics],Dimensions=[$dimensions]')
    table_name = state["dataset_name"]
    partitionTimeField = ''
    metrics = ''
    dimensions = ''
    mapping_info = state["mapping_info"]
    for field_alias, field_nature in mapping_info.items():
        if field_nature.endswith('_dimension'):
            if field_alias.endswith('time'):
                dimensions = dimensions + ',' + field_alias + ' Format yyyy-MM-dd 00:00:00'
            else:
                dimensions = dimensions + ',' + field_alias
        else:
            metrics = metrics + ',' + field_alias
    metrics = metrics[1:]
    dimensions = dimensions[1:]
    current_date = datetime.now().strftime("%Y-%m-%d")
    schema = schema_template.substitute(table_name=table_name, partitionTimeField=partitionTimeField, metrics=metrics, dimensions=dimensions)
    prompt_template = PromptTemplate(
            input_variables=["query","schema","current_date","sql"],
            template=sql_correction_prompt_template
        )
    llm = Tongyi(model_name="deepseek-r1", dashscope_api_key=os.environ["DASHSCOPE_API_KEY"], stream=True, verbose=True)
    chain = prompt_template | llm | StrOutputParser()
    examples = '''
    Query:show me the total tpv in 2024 of transaction time,Schema:Table=[transaction],PartitionTimeField=[],Metrics=[total tpv],Dimensions=[transaction time Format yyyy-MM-dd 00:00:00],ExtraInfo:CurrentDate=[2025-06-05],SQL:select sum({total tpv}) from transaction where {transaction time} >= '2024-01-01 00:00:00' AND {transaction time} <= '2024-12-31 23:59:59'
    '''
    sql = chain.invoke({"query":query, "schema":schema, "current_date":current_date,"sql":state["parsing_info"]["sql"]})
    state["correction_info"] = {}
    state["correction_info"]['sql'] = sql
    print(sql)

    return {
            **state,
            "current_phase": "transition"
        }