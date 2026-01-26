from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from app.vector_db import QdrantStorage
from llama_index.core import Settings
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI
from inngest.fast_api import serve
from ingest_pdfs import inngest_client, process_pdf_function


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

# @app.post("/upload-pdf")
# async def upload_pdf(file: UploadFile = File(...)):
#     """Sube PDF y triggerea procesamiento"""
#     if not file.filename.endswith('.pdf'):
#         raise HTTPException(400, "Solo PDFs")
    
#     pdf_content =  await file.read()
    
#     inngest_client.send_sync(
#         inngest_client.Event(
#             name="pdf/uploaded",
#             data={
#                 "pdf_content": pdf_content,
#                 "filename": file.filename
#             }
#         )
#     )


@app.get("/health")
async def health():
    return {"status": "healthy"}

serve(app, inngest_client, [process_pdf_function])