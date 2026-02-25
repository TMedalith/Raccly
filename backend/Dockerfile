FROM ghcr.io/astral-sh/uv:0.9.27 AS uv

FROM python:3.12-slim

WORKDIR /app

# Copy uv binary
COPY --from=uv /uv /bin/uv

# Install dependencies (cached layer, only rebuilds if lock file changes)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Copy app source
COPY ./app ./app

ENV PYTHONUNBUFFERED=1
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

# PORT env var is injected by Railway/Render automatically
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
