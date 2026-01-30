Python RAG service (LangChain + Vertex AI / OpenAI)

Setup

1. Create a virtualenv and install requirements:

```bash
cd backend/python_rag
python -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
```

2. Configure auth:
- For Gemini (Vertex AI) set `USE_GEMINI=true` and set `GOOGLE_APPLICATION_CREDENTIALS` to your service account JSON path.
- For OpenAI set `USE_GEMINI=false` and `OPENAI_API_KEY` in your environment.

Run

```bash
uvicorn app:app --reload --port 8000
```

Endpoints

- `POST /rag/build` — builds vectorstore by scanning `frontend/src`.
- `POST /rag/chat` — body `{"message":"..."}` returns `{"reply":"..."}`.
