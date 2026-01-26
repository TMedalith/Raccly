from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from vector_db import QdrantStorage
from llama_index.core import Settings
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI

load_dotenv()
app = FastAPI()


Settings.embed_model = OpenAIEmbedding(
    model="text-embedding-3-large",
    dimensions=3072
)

Settings.llm = OpenAI(
    model="gpt-4o-mini",
    temperature=0.2
)


class QueryRequest(BaseModel):
    question: str
    top_k: int = 5


@app.post("/query")
async def query(request: QueryRequest):
    query_engine = QdrantStorage().get_query_engine(top_k=request.top_k)
    response = query_engine.query(request.question)
    
    sources = []
    if hasattr(response, 'source_nodes'):
        sources = [node.metadata.get('source') for node in response.source_nodes]
    
    return {
        "answer": str(response),
        "sources": list(set(sources))
    }


@app.get("/health")
async def health():
    return {"status": "ok"}