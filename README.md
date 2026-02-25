# Raccly

Chat with 608 NASA bioscience papers. Ask anything, get cited answers.

Built for [NASA Space Apps Challenge 2024](https://www.spaceappschallenge.org/).

---

![Landing page](docs/screenshot-landing.png)

![Chat](docs/screenshot-chat.png)

---

## What it does

You type a question like *"what happens to bones during long missions?"* and it searches through hundreds of peer-reviewed NASA papers to give you an answer with inline citations and the actual source papers.

No hallucinations (hopefully). No paywalls. No account needed.

## Stack

- **Frontend** — Next.js 16, React 19, Framer Motion
- **Backend** — FastAPI, LlamaIndex, Qdrant, GPT-4o

## Running locally

**Backend**

```bash
cd backend
uv sync
uv run fastapi dev
```

Create `backend/.env`:

```
OPENAI_API_KEY=...
QDRANT_URL=...
QDRANT_API_KEY=...
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## How it works

![RAG flow](docs/rag-flow.png)

## Deployment

Frontend on [Vercel](https://raccly.vercel.app). Backend on FastAPI (self-hosted or any cloud).

---

MIT License
