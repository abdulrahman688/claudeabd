"""
Configuration Management for Pro-Small-Business AI Video Agent
Centralized settings with environment variable support
"""

import os
from pathlib import Path
from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable support."""

    # Application Settings
    APP_NAME: str = "Pro-Small-Business AI Video Agent"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = Field(default=False, description="Debug mode")

    # API Keys
    TELEGRAM_BOT_TOKEN: str = Field(..., description="Telegram Bot Token")
    ANTHROPIC_API_KEY: str = Field(..., description="Claude API Key")
    ELEVENLABS_API_KEY: str = Field(..., description="ElevenLabs API Key")

    # ElevenLabs Voice Settings
    ELEVENLABS_VOICE_ID: str = Field(
        default="pNInz6obpgDQGcFmaJgB",  # Adam - Warm, trustworthy voice
        description="ElevenLabs Voice ID for Arabic narration"
    )
    ELEVENLABS_MODEL_ID: str = Field(
        default="eleven_multilingual_v2",
        description="ElevenLabs model for high-quality Arabic"
    )

    # Claude Settings
    CLAUDE_MODEL: str = Field(
        default="claude-3-5-sonnet-20241022",
        description="Claude model version"
    )
    CLAUDE_MAX_TOKENS: int = Field(
        default=1024,
        description="Maximum tokens for Claude responses"
    )

    # Video Settings
    VIDEO_WIDTH: int = Field(default=1080, description="Video width (9:16 format)")
    VIDEO_HEIGHT: int = Field(default=1920, description="Video height (9:16 format)")
    VIDEO_FPS: int = Field(default=30, description="Frames per second")
    VIDEO_DURATION: int = Field(default=15, description="Video duration in seconds")
    ZOOM_FACTOR: float = Field(default=1.15, description="Ken Burns zoom factor")

    # Database Settings
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./ai_video_agent.db",
        description="Async SQLite database URL"
    )

    # File Storage
    TEMP_DIR: Path = Field(
        default=Path("app/static/temp"),
        description="Temporary files directory"
    )
    MAX_FILE_SIZE_MB: int = Field(
        default=20,
        description="Maximum upload file size in MB"
    )

    # Logging
    LOG_LEVEL: str = Field(default="INFO", description="Logging level")
    LOG_FORMAT: str = Field(
        default="json",
        description="Log format: json or console"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Ensure temp directory exists
        self.TEMP_DIR.mkdir(parents=True, exist_ok=True)

    @property
    def max_file_size_bytes(self) -> int:
        """Convert MB to bytes."""
        return self.MAX_FILE_SIZE_MB * 1024 * 1024


# Global settings instance
settings = Settings()
