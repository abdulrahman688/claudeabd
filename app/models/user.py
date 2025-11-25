"""
User and VideoProject models for tracking usage and analytics
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, DateTime, Text, Float, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class User(Base):
    """User model for tracking Telegram users."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    telegram_id: Mapped[int] = mapped_column(Integer, unique=True, nullable=False, index=True)
    username: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    first_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    last_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Usage tracking
    videos_created: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    last_active: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    def __repr__(self) -> str:
        return f"<User(telegram_id={self.telegram_id}, username={self.username})>"


class VideoProject(Base):
    """Video project model for tracking created videos."""

    __tablename__ = "video_projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    telegram_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    # Project details
    product_name: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    script: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    vibe: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # File paths
    image_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    audio_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    video_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Processing metadata
    processing_time_seconds: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(
        String(50),
        default="pending",
        comment="pending, processing, completed, failed"
    )
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    def __repr__(self) -> str:
        return f"<VideoProject(id={self.id}, product_name={self.product_name}, status={self.status})>"
