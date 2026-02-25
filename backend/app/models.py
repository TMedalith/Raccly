from pydantic import BaseModel, Field


class HistoryMessage(BaseModel):
    role: str
    content: str


class QueryRequest(BaseModel):
    question: str
    session_id: str = Field(default="default")
    top_k: int = 10
    use_rerank: bool = True
    use_hyde: bool = False
    chat_history: list[HistoryMessage] = []
