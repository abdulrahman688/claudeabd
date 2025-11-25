"""
Pro-Small-Business AI Video Agent
Main FastAPI Application Entry Point
"""

import asyncio
import logging
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import init_db, close_db
from app.bot import start_bot, setup_bot

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('ai_video_agent.log')
    ]
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Handles startup and shutdown events.
    """
    # Startup
    logger.info(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")

    try:
        # Initialize database
        logger.info("Initializing database...")
        await init_db()
        logger.info("✅ Database initialized")

        # Start Telegram bot
        logger.info("Starting Telegram bot...")
        bot = await start_bot()
        logger.info("✅ Telegram bot started")

        # Store bot in app state
        app.state.bot = bot

        logger.info("🎉 Application started successfully!")

        yield

    except Exception as e:
        logger.error(f"❌ Error during startup: {e}", exc_info=True)
        raise

    finally:
        # Shutdown
        logger.info("Shutting down application...")

        # Stop bot
        if hasattr(app.state, 'bot'):
            await app.state.bot.stop()
            logger.info("✅ Bot stopped")

        # Close database
        await close_db()
        logger.info("✅ Database connections closed")

        logger.info("👋 Application shut down complete")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Empowering small businesses with AI-powered video marketing",
    lifespan=lifespan
)


@app.get("/")
async def root():
    """Root endpoint - health check."""
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "message": "Pro-Small-Business AI Video Agent is operational! 🚀"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


@app.get("/stats")
async def get_stats():
    """Get application statistics."""
    from sqlalchemy import select, func
    from app.core.database import async_session_maker
    from app.models import User, VideoProject

    try:
        async with async_session_maker() as session:
            # Count users
            user_count_stmt = select(func.count(User.id))
            user_count_result = await session.execute(user_count_stmt)
            total_users = user_count_result.scalar()

            # Count videos
            video_count_stmt = select(func.count(VideoProject.id))
            video_count_result = await session.execute(video_count_stmt)
            total_videos = video_count_result.scalar()

            # Count completed videos
            completed_stmt = select(func.count(VideoProject.id)).where(
                VideoProject.status == "completed"
            )
            completed_result = await session.execute(completed_stmt)
            completed_videos = completed_result.scalar()

            return {
                "total_users": total_users,
                "total_videos": total_videos,
                "completed_videos": completed_videos,
                "success_rate": (
                    f"{(completed_videos / total_videos * 100):.1f}%"
                    if total_videos > 0 else "N/A"
                )
            }

    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to fetch statistics"}
        )


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc) if settings.DEBUG else "An error occurred"
        }
    )


if __name__ == "__main__":
    import uvicorn

    logger.info("Starting application via uvicorn...")

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
