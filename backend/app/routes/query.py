import json
import asyncio

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from llama_index.core import Settings

from app.config import limiter
from app.models import QueryRequest
from app.sessions import get_session, set_session, clear_session, session_count
from app.rag.retrieval import _prepare_nodes
from app.rag.context import deduplicate_nodes, format_context, build_messages
from app.rag.sources import filter_to_cited, extract_sources
from app.vector_db import QdrantStorage

router = APIRouter()

_storage: QdrantStorage | None = None


def get_storage() -> QdrantStorage:
    global _storage
    if _storage is None:
        _storage = QdrantStorage()
    return _storage


@router.post("/query-stream")
@limiter.limit("15/minute")
async def query_stream(request: Request, body: QueryRequest):
    try:
        storage = get_storage()
        session_history = get_session(body.session_id)
        if not session_history and body.chat_history:
            session_history = [{"role": m.role, "content": m.content} for m in body.chat_history]
            set_session(body.session_id, session_history)

        nodes = await asyncio.to_thread(
            _prepare_nodes, storage, body.question, session_history,
            body.top_k, body.use_rerank, body.use_hyde,
        )
        nodes = deduplicate_nodes(nodes)
        context = format_context(nodes)
        messages = build_messages(context, body.question, session_history)

        async def event_generator():
            full_response = ""
            async for chunk in await Settings.llm.astream_chat(messages):
                token = chunk.delta or ""
                if token:
                    full_response += token
                    yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"
            session_history.append({"role": "user", "content": body.question})
            session_history.append({"role": "assistant", "content": full_response})
            set_session(body.session_id, session_history)
            cited_nodes = filter_to_cited(nodes, full_response)
            sources = extract_sources(cited_nodes)
            yield f"data: {json.dumps({'type': 'sources', 'content': sources})}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/session/{session_id}")
async def clear_session_route(session_id: str):
    clear_session(session_id)
    return {"cleared": session_id}


@router.get("/health")
async def health():
    return {
        "status": "healthy",
        "active_sessions": session_count(),
    }
