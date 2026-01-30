import os
import re
from pathlib import Path
from typing import List, Optional, Tuple

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
load_dotenv()

app = FastAPI()

# CORS Setup
_allow_origins = os.environ.get('RAG_ALLOW_ORIGINS', '*')
origins = ['*'] if _allow_origins == '*' else [o.strip() for o in _allow_origins.split(',') if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
BEZUBAAN_PROMPT = """You are the official Bezubaan AI Assistant for Bezubaan NGO. 
Bezubaan NGO was started with a mission to be the voice for the voiceless. It focuses on rescuing stray animals, providing medical treatments, and finding forever homes for abandoned pets. It started when a group of animal lovers noticed the lack of emergency care for street animals and decided to create a dedicated network of caretakers and medical aid.

INSTRUCTIONS:
1. ONLY answer questions related to Bezubaan NGO, animal welfare, pet care, or animal medical treatments.
2. If a user asks about anything else (e.g., math, general news, coding, other companies), politely refuse and state that you are only authorized to assist with animal welfare and Bezubaan NGO queries.
3. Suggest basic first aid or treatments for common animal issues but ALWAYS advise the caretaker to consult a professional vet for serious cases.
4. Be empathetic, helpful, and professional.

Context from Bezubaan Database:
{context}

Chat History:
{chat_history}

Human: {question}
AI Assistant:"""

def strip_jsx(text: str) -> str:
    return re.sub(r"<[^>]*>|\{[^}]*\}", " ", text).replace('\n', ' ')

class MessageIn(BaseModel):
    message: str
    history: Optional[List[Tuple[str, str]]] = []

def get_embeddings():
    """Helper to initialize HuggingFace Embeddings (Runs locally)."""
    from langchain_huggingface import HuggingFaceEndpointEmbeddings
    # 'all-MiniLM-L6-v2' is fast and efficient for local use
    return HuggingFaceEndpointEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2",
                                         huggingfacehub_api_token=os.environ.get("HUGGINGFACEHUB_API_TOKEN"))

@app.post('/rag/build')
async def build_index():
    try:
        root = Path(__file__).resolve().parents[2] / 'frontend' / 'src'
        persist_dir = Path(__file__).resolve().parents[1] / 'data' / 'chroma'
        
        exts = {'.js', '.jsx', '.html', '.md'}
        files = [p for p in root.rglob('*') if p.suffix in exts]

        texts, metadatas = [], []
        
        try:
            from langchain_text_splitters import CharacterTextSplitter
            from langchain_community.vectorstores import Chroma
            embeddings = get_embeddings()
        except ImportError as e:
            raise HTTPException(status_code=500, detail=f"Missing dependencies: {str(e)}")

        for f in files:
            raw = f.read_text(encoding='utf8')
            txt = strip_jsx(raw).strip()
            if not txt: continue
                
            splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            chunks = splitter.split_text(txt)
            for i, c in enumerate(chunks):
                texts.append(c)
                metadatas.append({'source': str(f.relative_to(root)), 'chunk': i})

        if not texts: return {'ok': True, 'count': 0}

        persist_dir.mkdir(parents=True, exist_ok=True)
        # Use the HuggingFace embeddings to build the local vector DB
        Chroma.from_texts(
            texts=texts, 
            embedding=embeddings, 
            metadatas=metadatas, 
            persist_directory=str(persist_dir)
        )
        
        return {'ok': True, 'count': len(texts)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/rag/chat')
async def rag_chat(request: Request, body: Optional[MessageIn] = None):
    try:
        if body:
            message, history = body.message, body.history or []
        else:
            data = await request.json()
            message, history = data.get('message'), data.get('history', [])

        if not message:
            raise HTTPException(status_code=400, detail="Missing message")

        persist_dir = Path(__file__).resolve().parents[1] / 'data' / 'chroma'
        if not persist_dir.exists():
            raise HTTPException(status_code=400, detail='Index not built. Run /rag/build first.')

        try:
            from langchain_community.vectorstores import Chroma
            from langchain_groq import ChatGroq
            from langchain_classic.chains import ConversationalRetrievalChain
            
            embeddings = get_embeddings()
            # Initialize Groq LLM
            llm = ChatGroq(
                temperature=0.2, 
                model_name="llama-3.3-70b-versatile", # or "llama3-70b-8192"
                groq_api_key=os.environ.get("GROQ_API_KEY")
            )
        except ImportError as e:
            raise HTTPException(status_code=500, detail=f"Import error: {str(e)}")

        db = Chroma(persist_directory=str(persist_dir), embedding_function=embeddings)
        retriever = db.as_retriever(search_kwargs={'k': 3})
        CUSTOM_PROMPT = PromptTemplate(
            template=BEZUBAAN_PROMPT,
            input_variables=["context", "chat_history", "question"]
        )
        
        chain = ConversationalRetrievalChain.from_llm(
            llm=llm, 
            retriever=retriever,
            combine_docs_chain_kwargs={"prompt": CUSTOM_PROMPT},
            return_source_documents=True
        )

        res = chain.invoke({"question": message, "chat_history": history})
        
        return {
            'reply': res["answer"],
            'source_documents': [doc.metadata for doc in res["source_documents"]]
        }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))