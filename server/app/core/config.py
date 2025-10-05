from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, validator
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "starry-sts"
    CORS_ALLOW_ORIGINS: str = "*"
    cors_allow_origins: List[str] = ["*"]
    FIREBASE_SERVICE_ACCOUNT_B64: str = os.getenv('FIREBASE_SERVICE_ACCOUNT_B64', '')
    HF_TOKEN: str = os.getenv('HF_TOKEN', '')
    FALLBACK_ONLY: bool = os.getenv('FALLBACK_ONLY', 'false').lower() == 'true'
    DATABASE_URL: str = os.getenv('DATABASE_URL', 'sqlite:///./data.db')

settings = Settings()
