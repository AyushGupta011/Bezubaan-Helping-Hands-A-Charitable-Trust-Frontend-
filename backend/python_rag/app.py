import os
import re
from pathlib import Path
from typing import List, Optional, Tuple
from functools import lru_cache
import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI(title="Bezubaan RAG API", version="1.0.0")

# ============================================================================
# Configuration
# ============================================================================

class Config:
    """Centralized configuration for the application"""
    ALLOW_ORIGINS = os.getenv('RAG_ALLOW_ORIGINS', '*')
    HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    
    # Model settings
    EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
    LLM_MODEL = "llama-3.3-70b-versatile"
    LLM_TEMPERATURE = 0.2
    
    # Chunking settings
    CHUNK_SIZE = 1000
    CHUNK_OVERLAP = 200
    
    # Retrieval settings
    RETRIEVAL_K = 3
    
    # File processing
    ALLOWED_EXTENSIONS = {'.js', '.jsx', '.html', '.md'}
    
    @classmethod
    def get_root_dir(cls) -> Path:
        """Get root directory for frontend files"""
        return Path(__file__).resolve().parents[2] / 'frontend' / 'src'
    
    @classmethod
    def get_persist_dir(cls) -> Path:
        """Get persistence directory for vector DB"""
        return Path(__file__).resolve().parents[1] / 'data' / 'chroma'
    
    @classmethod
    def validate(cls):
        """Validate required environment variables"""
        if not cls.HUGGINGFACE_TOKEN:
            logger.warning("HUGGINGFACEHUB_API_TOKEN not set")
        if not cls.GROQ_API_KEY:
            logger.warning("GROQ_API_KEY not set")

Config.validate()

# ============================================================================
# CORS Setup
# ============================================================================

origins = ['*'] if Config.ALLOW_ORIGINS == '*' else [
    o.strip() for o in Config.ALLOW_ORIGINS.split(',') if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# ============================================================================
# Prompts
# ============================================================================

BEZUBAAN_PROMPT = """You are the official Bezubaan AI Assistant for Bezubaan NGO. 
Bezubaan NGO was started with a mission to be the voice for the voiceless. It focuses on rescuing stray animals, providing medical treatments, and finding forever homes for abandoned pets. It started when a group of animal lovers noticed the lack of emergency care for street animals and decided to create a dedicated network of caretakers and medical aid.

INSTRUCTIONS:
1. ONLY answer questions related to Bezubaan NGO, animal welfare, pet care, or animal medical treatments.
2. If a user asks about anything else (e.g., math, general news, coding, other companies), politely refuse and state that you are only authorized to assist with animal welfare and Bezubaan NGO queries.
3. Suggest basic first aid or treatments for common animal issues but ALWAYS advise the caretaker to consult a professional vet for serious cases.
4. Be empathetic, helpful, and professional.
5. Use the provided context to answer questions accurately.
6. If the context does not contain the answer, respond with "I'm sorry, I don't have that information."
7. Keep answers concise and to the point.
8. Always prioritize the well-being of animals in your responses.
9. NEVER tell the user that you are an AI model. Always respond as the Bezubaan AI Assistant.
10. NEVER share any personal or sensitive information.

Context from Bezubaan Database:
{context}

Chat History:
{chat_history}

Human Question:
{question}

AI Assistant:"""

# =============================================================================
# Models
# =============================================================================

class MessageIn(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)
    history: List[Tuple[str, str]] = Field(default_factory=list)

# =============================================================================
# Utility Functions
# =============================================================================

def strip_jsx(text: str) -> str:
    text = re.sub(r'<[^>]*>', ' ', text)
    text = re.sub(r'\{[^}]*\}', ' ', text)
    return ' '.join(text.split())

@lru_cache(maxsize=1)
def get_embeddings():
    from langchain_huggingface import HuggingFaceEndpointEmbeddings
    logger.info(f'Initializing embeddings: {Config.EMBEDDING_MODEL}')
    return HuggingFaceEndpointEmbeddings(
        model=Config.EMBEDDING_MODEL,
        huggingfacehub_api_token=Config.HUGGINGFACE_TOKEN
    )

@lru_cache(maxsize=1)
def get_llm():
    from langchain_groq import ChatGroq
    logger.info(f'Initializing LLM: {Config.LLM_MODEL}')
    return ChatGroq(
        temperature=Config.LLM_TEMPERATURE,
        model=Config.LLM_MODEL,
        groq_api_key=Config.GROQ_API_KEY
    )

# =============================================================================
# API Endpoints
# =============================================================================

@app.get('/')
async def root():
    return {'ok': True, 'message': 'Bezubaan RAG API is running', 'version': '1.0.0'}

@app.get('/health')
async def health_check():
    persist_dir = Config.get_persist_dir()
    return {'status': 'healthy', 'index_exists': persist_dir.exists()}

@app.post('/rag/build')
async def build_index():
    try:
        root_dir = Config.get_root_dir()
        persist_dir = Config.get_persist_dir()
        
        files = [p for p in root_dir.rglob('*') if p.suffix in Config.ALLOWED_EXTENSIONS]
        texts, metadatas = [], []
        
        from langchain_text_splitters import CharacterTextSplitter
        from langchain_community.vectorstores import Chroma
        
        embeddings = get_embeddings()
        splitter = CharacterTextSplitter(
            chunk_size=Config.CHUNK_SIZE,
            chunk_overlap=Config.CHUNK_OVERLAP
        )
        
        for f in files:
            raw = f.read_text(encoding='utf8', errors='ignore')
            txt = strip_jsx(raw).strip()
            if not txt: continue
            
            chunks = splitter.split_text(txt)
            for i, c in enumerate(chunks):
                texts.append(c)
                metadatas.append({'source': str(f.relative_to(root_dir)), 'chunk': i})
        
        if not texts:
            return {'ok': True, 'count': 0}
        
        persist_dir.mkdir(parents=True, exist_ok=True)
        Chroma.from_texts(texts=texts, embedding=embeddings, metadatas=metadatas, persist_directory=str(persist_dir))
        
        logger.info(f'Built index with {len(texts)} chunks')
        return {'ok': True, 'count': len(texts)}
        
    except Exception as e:
        logger.error(f'Build error: {e}', exc_info=True)
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
            raise HTTPException(status_code=400, detail='Missing message')
        
        persist_dir = Config.get_persist_dir()
        if not persist_dir.exists():
            raise HTTPException(status_code=400, detail='Index not built. Run /rag/build first.')
        
        from langchain_community.vectorstores import Chroma
        from langchain_classic.chains import ConversationalRetrievalChain
        
        embeddings = get_embeddings()
        llm = get_llm()
        
        db = Chroma(persist_directory=str(persist_dir), embedding_function=embeddings)
        retriever = db.as_retriever(search_kwargs={'k': Config.RETRIEVAL_K})
        
        custom_prompt = PromptTemplate(
            template=BEZUBAAN_PROMPT,
            input_variables=['context', 'chat_history', 'question']
        )
        
        chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=retriever,
            combine_docs_chain_kwargs={'prompt': custom_prompt},
            return_source_documents=True
        )
        
        res = chain.invoke({'question': message, 'chat_history': history})
        
        logger.info(f'Chat request processed successfully')
        
        return {
            'reply': res['answer'],
            'source_documents': [doc.metadata for doc in res['source_documents']]
        }
        
    except Exception as e:
        logger.error(f'Chat error: {e}', exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))