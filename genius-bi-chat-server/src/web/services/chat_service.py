from pydantic import AliasChoices, BaseModel, Field

class ChatRequest(BaseModel):
    query_id: str
    query: str

class ChatService:
    def __init__(self, pipelines: Dict[str, BasicPipeline]):
        self._pipelines = pipelines
    def ask(self, chatRequest: ChatRequest):
        