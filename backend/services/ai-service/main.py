from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.routers import sham_chatbot, risk_assessment, fraud_detection, nlp_engine
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 AI Service starting up...")
    yield
    # Shutdown
    print("👋 AI Service shutting down...")


app = FastAPI(
    title="SHAM AI Service",
    description="AI-powered services for SHAM platform",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(
    sham_chatbot.router,
    prefix="/api/v1/ai/chat",
    tags=["Sham AI Chatbot"]
)

app.include_router(
    risk_assessment.router,
    prefix="/api/v1/ai/risk",
    tags=["Risk Assessment"]
)

app.include_router(
    fraud_detection.router,
    prefix="/api/v1/ai/fraud",
    tags=["Fraud Detection"]
)

app.include_router(
    nlp_engine.router,
    prefix="/api/v1/ai/nlp",
    tags=["NLP Engine"]
)


@app.get("/")
async def root():
    return {
        "service": "SHAM AI Service",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.DEBUG,
    )
