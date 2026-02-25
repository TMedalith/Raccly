# Raccly

RAG chatbot over 608 NASA bioscience papers. Ask anything, get cited answers with source excerpts.

Built for [NASA Space Apps Challenge 2024](https://www.spaceappschallenge.org/).

**[raccly.vercel.app](https://raccly.vercel.app)** — Frontend on Vercel, backend on Railway.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, React 19, Framer Motion |
| Backend | FastAPI, LlamaIndex, GPT-4o |
| Vector DB | Qdrant Cloud (text-embedding-3-large, 3072d) |
| Infra | Vercel + Railway |

## How the RAG pipeline works

1. **Query condensation** — GPT-4o-mini rewrites follow-up questions into standalone queries using conversation history
2. **Retrieval** — semantic search over 608 papers in Qdrant (top-k × 2 when reranking)
3. **Reranking** — LLM-based cross-encoder reranker filters to top-k most relevant chunks
4. **HyDE** — optional hypothetical document embedding to improve recall on vague queries
5. **Context building** — deduplication + metadata enrichment in a single Qdrant batch call
6. **Generation** — GPT-4o streams the response with inline `[n]` citations
7. **Source filtering** — only papers actually cited in the response are returned to the frontend

## Architecture

```
frontend/          Next.js 16 (App Router)
├── features/chat  ChatInterface, ConversationSidebar, SourcesPanel
└── shared/        ConditionalLayout, storage utils

backend/           FastAPI
├── app/rag/       retrieval, context building, source extraction
├── app/routes/    /query-stream (SSE), /session/:id, /health
└── app/           config (LLM settings), models, sessions
```

Streaming via SSE — the frontend reads token chunks as they arrive, sources are sent at the end of the stream once citation filtering runs.

Sessions are stored in-memory per backend instance with localStorage fallback on the frontend.

## Running locally

**Backend**
```bash
cd backend
uv sync
uv run fastapi dev
```

`backend/.env`:
```
OPENAI_API_KEY=
QDRANT_URL=
QDRANT_API_KEY=
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

`frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

MIT License
