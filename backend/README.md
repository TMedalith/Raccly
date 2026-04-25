# Raccly Backend

RAG API for scientific papers. Upload PDFs → retrieve relevant chunks → generate cited answers.


---

## Project Structure

```
backend/
├── app/
│   ├── main.py                    # FastAPI app + lifespan
│   ├── config.py                  # Settings (env vars)
│   ├── models.py                  # Pydantic request models
│   ├── routes/
│   │   ├── ingest.py             # POST /ingest (upload PDFs)
│   │   └── query.py              # POST /query-stream (SSE)
│   ├── storage/
│   │   └── vector_db.py          # PostgreSQL wrapper
│   ├── retrieval/
│   │   └── search.py             # Similarity search + rerank
│   ├── ingest/
│   │   ├── parser.py             # Docling PDF parsing
│   │   └── pipeline.py           # Ingest orchestration
│   └── generation/
│       └── pipeline.py           # Context + LLM streaming
├── pyproject.toml                # Dependencies
└── README.md                      # This file
## Installation

```bash
cd backend
pip install -e .
```

Environment (`.env`):
```env
OPENAI_API_KEY=sk-xxx
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=pwd
PG_DATABASE=raccly
COHERE_API_KEY=xxx
```

## Running

```bash
uvicorn app.main:app --reload
```


## API

### POST `/ingest`

```bash
curl -X POST -F "file=@paper.pdf" http://localhost:8000/ingest
```

Response:
```json
{
  "filename": "paper.pdf",
  "chunks": 42,
  "tokens_embedded": 3847
}
```

### POST `/query-stream`

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"question": "What is MscL?", "top_k": 5}' \
  http://localhost:8000/query-stream
```

Response (SSE):
```
data: {"type": "token", "content": "The"}
data: {"type": "token", "content": " pentamer"}
...
data: {"type": "sources", "content": [...]}
data: [DONE]
```

---

## How It Works

**Ingest:**
1. Docling extracts text + metadata
2. Chunk into 512-token windows (128 overlap)
3. Embed with text-embedding-3-large
4. Store in PostgreSQL pgvector

**Query:**
1. Embed question
2. Similarity search (cosine) → top-10
3. Cohere rerank → top-6
4. Assemble context as [1] Title, [2] Title, ...
5. Stream GPT-4o response with inline citations


---

## Stack

- **API**: FastAPI
- **Vector DB**: PostgreSQL + pgvector
- **Embeddings**: OpenAI text-embedding-3-large
- **LLM**: GPT-4o
- **PDF Parser**: Docling
- **Reranker**: Cohere v3.5
- **Framework**: LlamaIndex

---

## Features

- Streaming SSE responses
- Automatic inline citations [1][2][3]
- Metadata preservation (title, authors, year, doi)
- Similarity filtering (0.50 threshold)
- Cohere reranking
- Chunk deduplication

---

