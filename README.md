# NASA RAG System

Sistema de consultas sobre documentación de la NASA usando Retrieval-Augmented Generation (RAG).

## 🚀 Stack

- **FastAPI** - API REST
- **LlamaIndex** - RAG framework
- **Qdrant** - Vector database
- **OpenAI** - Embeddings y LLM
- **AWS Lambda** - Serverless deployment

## 📦 Instalación
```bash
# Instalar uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Instalar dependencias
uv sync
```

## 🔧 Configuración

Crear archivo `.env`:
```env
QDRANT_URL=tu-url
QDRANT_API_KEY=tu-key
OPENAI_API_KEY=tu-key
```

## 🏃 Desarrollo local
```bash
uv run fastapi dev
```

Abre http://localhost:8000/docs

## 🌐 Producción

**Endpoints:**
- `POST /query` - Consultar documentación
- `GET /docs` - Documentación interactiva
