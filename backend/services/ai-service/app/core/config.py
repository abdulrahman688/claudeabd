from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Server
    PORT: int = 8000
    DEBUG: bool = True

    # API Keys
    ANTHROPIC_API_KEY: str
    OPENAI_API_KEY: str = ""

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/sham"

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]

    # Models
    SHAM_MODEL: str = "claude-sonnet-4-20250514"
    RISK_MODEL_PATH: str = "models/risk_assessment.pkl"
    FRAUD_MODEL_PATH: str = "models/fraud_detection.pkl"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
