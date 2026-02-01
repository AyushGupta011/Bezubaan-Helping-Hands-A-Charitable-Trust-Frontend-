import os
import re
import logging
from pathlib import Path
from typing import List, Optional, Tuple
from functools import lru_cache
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from langchain_core.prompts import PromptTemplate
from langchain_classic.chains import ConversationalRetrievalChain
from langchain_text_splitters import CharacterTextSplitter

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Global variable for the RAG chain
chain = None

# ============================================================================
# Configuration
# ============================================================================

class Config:
    ALLOW_ORIGINS = os.getenv('RAG_ALLOW_ORIGINS', '*')
    HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    PINECONE_INDEX = os.getenv("PINECONE_INDEX_NAME", "bezubaan-chatbot")
    
    EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
    LLM_MODEL = "llama-3.3-70b-versatile"
    LLM_TEMPERATURE = 0.2
    
    CHUNK_SIZE = 1000
    CHUNK_OVERLAP = 200
    RETRIEVAL_K = 3
    
    ALLOWED_EXTENSIONS = {'.js', '.jsx', '.html', '.md'}
    
    @classmethod
    def get_root_dir(cls) -> Path:
        # Adjusted to find the src folder relative to this script
        """
        Navigates: 
        1. some_subfolder/ (current)
        2. backend/ (.parent)
        3. bezubaaan(pending)/ (.parent.parent)
        4. frontend/src/
        """
        # Get the directory of app.py
        current_dir = Path(__file__).resolve().parent
        
        # Go up two levels to reach the main project root
        project_root = current_dir.parent.parent
        
        target = project_root / 'frontend' / 'src'
        
        # This will print the path in your console so you can double-check it
        print(f"DEBUG: Looking for frontend at: {target.absolute()}")
        
        return target
    

# ============================================================================
# Utility Functions
# ============================================================================

def strip_jsx(text: str) -> str:
    text = re.sub(r'<[^>]*>', ' ', text)
    text = re.sub(r'\{[^}]*\}', ' ', text)
    return ' '.join(text.split())

@lru_cache(maxsize=1)
def get_embeddings():
    from langchain_huggingface import HuggingFaceEndpointEmbeddings
    return HuggingFaceEndpointEmbeddings(
        model=Config.EMBEDDING_MODEL,
        huggingfacehub_api_token=Config.HUGGINGFACE_TOKEN
    )

@lru_cache(maxsize=1)
def get_llm():
    from langchain_groq import ChatGroq
    return ChatGroq(
        temperature=Config.LLM_TEMPERATURE,
        model=Config.LLM_MODEL,
        groq_api_key=Config.GROQ_API_KEY
    )

# ============================================================================
# Lifespan (Startup/Shutdown)
# ============================================================================

@asynccontextmanager
async def init_chain(app: FastAPI):
    global chain
    logger.info("🚀 Initializing Bezubaan RAG...")

    # 1. Process local files for indexing
    # root_dir = Config.get_root_dir()
    # texts, metadatas = [], []
    
    # if root_dir.exists():
    #     splitter = CharacterTextSplitter(chunk_size=Config.CHUNK_SIZE, chunk_overlap=Config.CHUNK_OVERLAP)
    #     for f in root_dir.rglob("*"):
    #         if f.suffix in Config.ALLOWED_EXTENSIONS:
    #             raw = f.read_text(encoding="utf8", errors="ignore")
    #             clean = strip_jsx(raw)
    #             for i, chunk in enumerate(splitter.split_text(clean)):
    #                 texts.append(chunk)
    #                 metadatas.append({"source": f.name, "chunk": i})
    #     logger.info(f"📄 Found {len(texts)} text chunks to index.")
    # else:
    #     logger.warning(f"⚠️ Source directory {root_dir} not found. Skipping file indexing.")

    # 2. Connect to Pinecone
    pc = Pinecone(api_key=Config.PINECONE_API_KEY)
    embeddings = get_embeddings()
    
    vectorstore = PineconeVectorStore(
        index_name=Config.PINECONE_INDEX,
        embedding=embeddings,
        pinecone_api_key=Config.PINECONE_API_KEY
    )

    # 3. Add texts if any were found
    # if texts:
    #     vectorstore.add_texts(texts=texts, metadatas=metadatas)
    #     logger.info("✅ Successfully uploaded chunks to Pinecone.")


    
    # index_name = "bezubaan-chatbot"

    # if not pc.has_index(index_name):
    #    pc.create_index_for_model(
    #     name=index_name,
    #     cloud="aws",
    #     region="us-east-1",
    #     embed={
    #         "model":"llama-text-embed-v2",
    #         "field_map":{"text": "chunk_text"}
    #     }
    # )

    # 4. Create Chain
    prompt = PromptTemplate(
        template=BEZUBAAN_PROMPT,
        input_variables=["context", "chat_history", "question"]
    )

    chain = ConversationalRetrievalChain.from_llm(
        llm=get_llm(),
        retriever=vectorstore.as_retriever(search_kwargs={"k": Config.RETRIEVAL_K}),
        combine_docs_chain_kwargs={"prompt": prompt},
        return_source_documents=True
    )

    logger.info("✅ Bezubaan RAG System Ready")
    yield
    logger.info("🛑 Shutting down...")

# ============================================================================
# FastAPI Setup
# ============================================================================

app = FastAPI(title="Bezubaan RAG API", lifespan=init_chain)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
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

class MessageIn(BaseModel):
    message: str
    history: List[Tuple[str, str]] = []

@app.get('/')
async def root():
    return {'status': 'online', 'agent': 'Bezubaan AI'}

@app.post('/rag/chat')
async def rag_chat(body: MessageIn):
    global chain
    if not chain:
        raise HTTPException(status_code=503, detail="System initializing...")
    
    try:
        res = chain.invoke({
            'question': body.message,
            'chat_history': body.history
        })
        return {
            'reply': res['answer'],
            'source_documents': [doc.metadata for doc in res['source_documents']]
        }
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)