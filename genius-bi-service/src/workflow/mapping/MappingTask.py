import spacy
from spacy.tokenizer import Tokenizer
from spacy.util import compile_infix_regex, compile_prefix_regex, compile_suffix_regex


# 加载英文模型
nlp = spacy.load("en_core_web_sm")

# 读取自定义词典
custom_terms = execute_mysql_query('''
select name,concat('_',model_id,'_',id,'_','dimension') nature from s2_dimension where model_id = 16 or model_id = 17 or model_id = 18

    union 

    select name, concat('_',model_id,'_',id,'_','metric') nature from s2_metric where model_id = 16 or model_id = 17 or model_id = 18
''')

# 添加特殊分词规则（确保自定义词不被拆分）
result_dict = dict(custom_terms)
for term in custom_terms:
    # 将术语转换为spaCy的Token格式
    (a,b) = (term[0].replace("_", " "), term[1])  # 处理下划线分隔的术语（如"machine_learning"）
    nlp.tokenizer.add_special_case(a, [{"ORTH": a}])

# 修改分词器的中缀规则（处理连字符、缩写等）
infixes = list(nlp.Defaults.infixes) + [r'(?<=[a-zA-Z])-(?=[a-zA-Z])']  # 允许 "state-of-the-art" 作为整体
infix_regex = compile_infix_regex(infixes)
nlp.tokenizer.infix_finditer = infix_regex.finditer

def custom_tokenize(text):
    doc = nlp(text)
    # 覆盖词性标签（如果命中自定义词典）
    for token in doc:
        if token.text in result_dict:
            token.tag_ = result_dict[token.text]
    return doc

# 测试句子
text = "show me amount by month in 2004"
doc = custom_tokenize(text)

# 输出分词及词性
for token in doc:
    print(f"Text: {token.text.ljust(20)} POS: {token.tag_}")

