import os
import sys
import logging
import asyncio
from typing import Optional, Dict, Any, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import AdvancedGraphRAGSystem
from config import DEFAULT_CONFIG

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Global system instance
rag_system: Optional[AdvancedGraphRAGSystem] = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for the FastAPI app"""
    global rag_system
    logger.info("Initializing AI Cooking System...")
    try:
        rag_system = AdvancedGraphRAGSystem()
        rag_system.initialize_system()
        # We run build_knowledge_base in a non-blocking way if possible, 
        # but for now we'll do it synchronously to ensure readiness.
        # In a production app, this might be a background task or check.
        rag_system.build_knowledge_base()
        logger.info("AI Cooking System Ready!")
    except Exception as e:
        logger.error(f"Failed to initialize system: {e}")
        raise e
    
    yield
    
    logger.info("Shutting down AI Cooking System...")
    if rag_system:
        rag_system._cleanup()

app = FastAPI(title="AI Cooking Assistant API", lifespan=lifespan)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---

class ChatRequest(BaseModel):
    question: str
    stream: bool = True

class ChatResponse(BaseModel):
    answer: str
    analysis: Dict[str, Any]

class StatsResponse(BaseModel):
    total_recipes: int
    total_ingredients: int
    total_documents: int
    vector_indices: int
    total_queries: int

# --- Endpoints ---

@app.get("/api/health")
async def health_check():
    if not rag_system or not rag_system.system_ready:
        raise HTTPException(status_code=503, detail="System not ready")
    return {"status": "healthy"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    if not rag_system or not rag_system.system_ready:
        raise HTTPException(status_code=503, detail="System not ready")

    if request.stream:
        return StreamingResponse(
            stream_chat_generator(request.question),
            media_type="text/event-stream"
        )
    else:
        try:
            result, analysis = rag_system.ask_question_with_routing(
                request.question, 
                stream=False, 
                explain_routing=True
            )
            
            # Convert analysis object to dict if it isn't already
            analysis_dict = {}
            if analysis:
                analysis_dict = {
                    "strategy": analysis.recommended_strategy.value,
                    "complexity": analysis.query_complexity,
                    "relationship_intensity": analysis.relationship_intensity,
                    "reasoning": analysis.reasoning
                }

            return ChatResponse(answer=result, analysis=analysis_dict)
        except Exception as e:
            logger.error(f"Error processing chat: {e}")
            raise HTTPException(status_code=500, detail=str(e))

async def stream_chat_generator(question: str):
    """Generator for streaming chat responses"""
    try:
        # We need to adapt the generator from the system
        # The system's generator yields text chunks
        
        # First, we get the routing analysis
        # Note: The current system implementation mixes printing and returning.
        # We might need to refactor `ask_question_with_routing` slightly 
        # or capture its output. 
        # For now, we will use a modified approach to get the generator directly.
        
        # Step 1: Route
        relevant_docs, analysis = rag_system.query_router.route_query(question, rag_system.config.top_k)
        
        # Send analysis as the first event
        import json
        analysis_data = {
            "type": "analysis",
            "data": {
                "strategy": analysis.recommended_strategy.value,
                "complexity": analysis.query_complexity,
                "relationship_intensity": analysis.relationship_intensity,
                "relevant_docs": [
                    {
                        "name": doc.metadata.get('recipe_name', 'Unknown'),
                        "score": doc.metadata.get('final_score', 0),
                        "type": doc.metadata.get('search_type', 'unknown')
                    } for doc in relevant_docs
                ]
            }
        }
        yield f"data: {json.dumps(analysis_data)}\n\n"
        
        # Step 2: Generate
        # We use the generation module directly to get the stream
        for chunk in rag_system.generation_module.generate_adaptive_answer_stream(question, relevant_docs):
            chunk_data = {
                "type": "token",
                "data": chunk
            }
            yield f"data: {json.dumps(chunk_data)}\n\n"
            await asyncio.sleep(0.01) # Small yield to let event loop breathe
            
        yield "data: [DONE]\n\n"
        
    except Exception as e:
        logger.error(f"Streaming error: {e}")
        error_data = {"type": "error", "data": str(e)}
        yield f"data: {json.dumps(error_data)}\n\n"

@app.get("/api/stats", response_model=StatsResponse)
async def get_stats():
    if not rag_system:
        raise HTTPException(status_code=503, detail="System not initialized")
        
    data_stats = rag_system.data_module.get_statistics()
    milvus_stats = rag_system.index_module.get_collection_stats()
    route_stats = rag_system.query_router.get_route_statistics()
    
    return StatsResponse(
        total_recipes=data_stats.get('total_recipes', 0),
        total_ingredients=data_stats.get('total_ingredients', 0),
        total_documents=data_stats.get('total_documents', 0),
        vector_indices=milvus_stats.get('row_count', 0),
        total_queries=route_stats.get('total_queries', 0)
    )

@app.post("/api/rebuild")
async def rebuild_knowledge_base(background_tasks: BackgroundTasks):
    """Trigger a rebuild in the background"""
    if not rag_system:
        raise HTTPException(status_code=503, detail="System not initialized")
    
    background_tasks.add_task(rebuild_task)
    return {"status": "Rebuild started in background"}

def rebuild_task():
    logger.info("Starting background rebuild...")
    try:
        rag_system._rebuild_knowledge_base(force=True)
    except Exception as e:
        logger.error(f"Rebuild failed: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
