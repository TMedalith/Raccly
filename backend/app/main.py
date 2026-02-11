from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from app.vector_db import QdrantStorage
from llama_index.core import Settings
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI
from fastapi.responses import StreamingResponse
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware
import json


load_dotenv()
app = FastAPI()
handler = Mangum(app)

origins = [
    "http://localhost:3000",
    "https://raccly.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

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


@app.post("/query-stream")    
async def sse_endpoint(request: QueryRequest):
    try:
        storage = QdrantStorage()
        query_engine = storage.get_query_engine(streaming=True, top_k=request.top_k)
        response = query_engine.query(request.question)
        
        def event_generator():
            # Stream tokens
            for token in response.response_gen:
                yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"
            
            # Send sources at the end
            sources = []
            if hasattr(response, 'source_nodes'):
                sources = [node.metadata.get('source', 'Unknown') for node in response.source_nodes]
            
            yield f"data: {json.dumps({'type': 'sources', 'content': list(set(sources))})}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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

#serve(app, inngest_client, [process_pdf_function])