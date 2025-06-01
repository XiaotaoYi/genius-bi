import spacy
from spacy.tokenizer import Tokenizer
from spacy.util import compile_infix_regex, compile_prefix_regex, compile_suffix_regex


class MappingTask:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm") # Load English model
        

# Read custom dictionary
custom_terms = execute_mysql_query('''
select name,concat('_',model_id,'_',id,'_','dimension') nature from s2_dimension where model_id = 16 or model_id = 17 or model_id = 18

    union 

    select name, concat('_',model_id,'_',id,'_','metric') nature from s2_metric where model_id = 16 or model_id = 17 or model_id = 18
''')

# Add special tokenization rules (ensure custom terms are not split)
result_dict = dict(custom_terms)
for term in custom_terms:
    # Convert terms to spaCy Token format
    (a,b) = (term[0].replace("_", " "), term[1])  # Handle terms separated by underscores (e.g., "machine_learning")
    nlp.tokenizer.add_special_case(a, [{"ORTH": a}])

# Modify tokenizer's infix rules (handle hyphens, abbreviations, etc.)
infixes = list(nlp.Defaults.infixes) + [r'(?<=[a-zA-Z])-(?=[a-zA-Z])']  # Allow "state-of-the-art" as a whole
infix_regex = compile_infix_regex(infixes)
nlp.tokenizer.infix_finditer = infix_regex.finditer

def custom_tokenize(text):
    doc = nlp(text)
    # Override POS tags (if matched in custom dictionary)
    for token in doc:
        if token.text in result_dict:
            token.tag_ = result_dict[token.text]
    return doc

# Test sentence
text = "show me amount by month in 2004"
doc = custom_tokenize(text)

# Output tokens and POS tags
for token in doc:
    print(f"Text: {token.text.ljust(20)} POS: {token.tag_}")

