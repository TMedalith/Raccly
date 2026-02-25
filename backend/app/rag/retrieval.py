from app.config import _mini_llm, CONDENSE_PROMPT


def condense_question(question: str, history: list[dict]) -> str:
    if not history:
        return question
    history_str = "\n".join(
        f"{m['role'].upper()}: {m['content']}" for m in history[-6:]
    )
    prompt = CONDENSE_PROMPT.format(history=history_str, question=question)
    try:
        result = _mini_llm.complete(prompt)
        condensed = str(result).strip()
        return condensed if condensed else question
    except Exception as e:
        print(f"[condense] {e}")
        return question


def _prepare_nodes(storage, question: str, history: list[dict], top_k: int, use_rerank: bool, use_hyde: bool):
    condensed = condense_question(question, history)
    return storage.retrieve_nodes(condensed, top_k, use_rerank, use_hyde)
