# Read custom dictionary
import spacy
from spacy.tokenizer import Tokenizer
from spacy.util import compile_infix_regex, compile_prefix_regex, compile_suffix_regex
from src.dataprovider.mysql.mysql_db import execute_sql
from sqlalchemy.orm import Session
from src.models.word_with_nature import WordWithNature
import difflib

def edit_distance_lib(s1, s2):
    return difflib.SequenceMatcher(None, s1, s2).ratio()

class TrieNode:
    def __init__(self, word=None, pos=None):
        self.word = word      # Current word
        self.pos = pos        # POS tag for this word
        self.children = {}    # Next words: word → TrieNode
        self.is_end = False   # Marks end of a sentence
        
class SentenceTrie:
    def __init__(self):
        self.root = TrieNode()
        self.nlp = spacy.load("en_core_web_sm")
    def insert(self, sentence: str, nature: str):
        """Insert a sentence into the trie"""
        doc = self.nlp(sentence)

        tokens = [(token.text, token.pos_) for token in doc if not token.is_punct]
        
        node = self.root
        for word, pos in tokens:
            if word not in node.children:
                node.children[word] = TrieNode(word, nature)
            node = node.children[word]
        node.is_end = True
    def search_prefix(self, prefix):
        """Find all sentences starting with given prefix"""
        doc = self.nlp(prefix)
        tokens = [token.text for token in doc if not token.is_punct]
        
        # Traverse to the end of the prefix
        node = self.root
        for word in tokens:
            if word not in node.children:
                return []
            node = node.children[word]
        
        # Collect all sentences starting from this node
        return self._dfs(node, prefix, [], prefix)
    
    def _dfs(self, node, current_sentence, results, prefix):
        """Depth-first search to collect complete sentences"""
        if node.is_end:
            results.append((current_sentence, node.pos, edit_distance_lib(prefix, current_sentence)))
        
        for child_word, child_node in node.children.items():
            new_sentence = f"{current_sentence} {child_word}"
            self._dfs(child_node, new_sentence, results, prefix)
            
        return results

    def visualize(self, node=None, level=0, prefix=""):
        """Print the trie structure"""
        if node is None:
            node = self.root
            
        indent = "    " * level
        node_info = f"{node.word} ({node.pos})" if node.word else "ROOT"
        print(f"{indent}{node_info}")
        
        for child_word, child_node in node.children.items():
            self.visualize(child_node, level + 1, prefix + child_word)

class SpacyUtil:
    def __init__(self) -> None:
        sql = '''
                select alias as word, concat('_',model_id,'_',id,'_','dimension') as nature from model_dimension_tbl 
                union 
                select alias as word, concat('_',model_id,'_',id,'_','metric') as nature from model_metric_tbl
                union 
                select synonym as word, concat('_',id,'_','term') as nature from term_tbl
              '''
        wordWithNatures = execute_sql(sql, '', WordWithNature)

        self.nlp = spacy.load("en_core_web_sm")
        
        # Add special tokenization rules (ensure custom terms are not split)
        self.word_dict = {}
        self.prefix_trie = SentenceTrie()
        for term in wordWithNatures:
            self.word_dict[term.word] = term.nature
            self.prefix_trie.insert(term.word, term.nature)
            # Convert terms to spaCy Token format
            self.nlp.tokenizer.add_special_case(term.word, [{"ORTH": term.word}])
        # Modify tokenizer's infix rules (handle hyphens, abbreviations, etc.)
        infixes = list(self.nlp.Defaults.infixes) + [r'(?<=[a-zA-Z])-(?=[a-zA-Z])']  # Allow "state-of-the-art" as a whole
        infix_regex = compile_infix_regex(infixes)
        self.nlp.tokenizer.infix_finditer = infix_regex.finditer
    def prefix_match_words(self, text: str) -> list:
        words = text.split()
        # enumerate all substring
        all_combinations = []
        for start in range(len(words)):
            for end in range(start + 1, len(words) + 1):
                phrase = " ".join(words[start:end])
                all_combinations.append(phrase)
        results = []
        for i, phrase in enumerate(all_combinations, 1):
            results = results + self.prefix_trie.search_prefix(phrase)
        results = list(set(results))

        return results
    def suffix_match_words(self, text:str) -> None:
        pass 
    def tokenize(self, text) -> dict[str,str]:
        ret = {}

        doc = self.nlp(text)
        # Override POS tags (if matched in custom dictionary)
        for token in doc:
            if token.text in self.word_dict:
                token.tag_ = self.word_dict[token.text]
                ret[token.text] = token.tag_

        return ret

spacy_util = SpacyUtil()
#text = "show me total tpv by is cross order payment in 2004"
#results = spacy_util.prefix_match_words(text)
#for item in results:
#    print(item)
#doc = spacy_util.tokenize(text)
#for token, pos in doc.items():
#    print(f"Text: {token} POS: {pos}")