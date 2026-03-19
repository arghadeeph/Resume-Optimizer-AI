from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Resume Optimizer API"
    database_url: str = Field(default="sqlite:///./linkedin_optimizer.db")
    openai_api_key: Optional[str] = Field(default=None)
    openai_model: str = Field(default="gpt-4.1-mini")
    openai_base_url: str = Field(default="https://api.openai.com/v1")
    allow_ai_fallback: bool = Field(default=False)
    rate_limit_per_minute: int = Field(default=20)

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
