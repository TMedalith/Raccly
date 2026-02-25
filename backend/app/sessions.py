_sessions: dict[str, list[dict]] = {}


def get_session(session_id: str) -> list[dict]:
    return _sessions.get(session_id, [])


def set_session(session_id: str, history: list[dict]) -> None:
    _sessions[session_id] = history


def clear_session(session_id: str) -> None:
    _sessions.pop(session_id, None)


def session_count() -> int:
    return len(_sessions)
