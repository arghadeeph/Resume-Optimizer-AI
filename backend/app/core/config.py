from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "LinkedIn AI Profile Optimizer API"
    database_url: str = Field(default="sqlite:///./linkedin_optimizer.db")
    ollama_url: str = Field(default="http://ollama:11434")
    ollama_model: str = Field(default="llama3")
    rate_limit_per_minute: int = Field(default=20)

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
