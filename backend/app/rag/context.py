from llama_index.core.llms import ChatMessage, MessageRole
from app.config import _CITATION_RE, SYSTEM_PROMPT


def deduplicate_nodes(nodes: list) -> list:
    best: dict[str, tuple] = {}
    for node in nodes:
        source_id = node.metadata.get("source") or node.node_id
        score = node.metadata.get("_cosine") or (node.score if node.score else 0)
        if source_id not in best or score > best[source_id][1]:
            best[source_id] = (node, score)
    seen_order = []
    seen_ids: set[str] = set()
    for node in nodes:
        sid = node.metadata.get("source") or node.node_id
        if sid not in seen_ids:
            seen_ids.add(sid)
            seen_order.append(best[sid][0])
    return seen_order


def format_context(nodes: list) -> str:
    parts = []
    for i, node in enumerate(nodes, 1):
        title = node.metadata.get("title") or node.metadata.get("source", "Unknown")
        year = node.metadata.get("year", "")
        text = node.node.get_content() if node.node else ""
        text = _CITATION_RE.sub("", text)
        header = f"[{i}] {title}" + (f" ({year})" if year else "")
        parts.append(f"{header}\n{text}")
    return "\n\n".join(parts)


def build_messages(context: str, question: str, history: list[dict]) -> list[ChatMessage]:
    messages = [ChatMessage(role=MessageRole.SYSTEM, content=SYSTEM_PROMPT)]
    for msg in history[-6:]:
        role = MessageRole.USER if msg["role"] == "user" else MessageRole.ASSISTANT
        messages.append(ChatMessage(role=role, content=msg["content"]))
    user_content = (
        "Research paper excerpts (cite inline as [1], [2], [3], …):\n"
        "─────────────────────────────────────────\n"
        f"{context}\n"
        "─────────────────────────────────────────\n\n"
        f"QUESTION: {question}\n\n"
        "ANSWER — use markdown: start with a 1-2 sentence overview, "
        "then a ## section for each distinct mechanism or topic, "
        "with bullet points inside each section. "
        "CRITICAL: you MUST cite the specific source number ([1], [2], [3]…) "
        "for every bullet point. If multiple sources cover different aspects, "
        "cite each one — do NOT use only [1] throughout the entire answer:"
    )
    messages.append(ChatMessage(role=MessageRole.USER, content=user_content))
    return messages
