from __future__ import annotations

from pydantic import BaseModel, field_validator
from typing import List
from urllib.parse import urlparse


class AnalyzeProfileRequest(BaseModel):
    profile_url: str

    @field_validator("profile_url")
    @classmethod
    def validate_linkedin_url(cls, value: str) -> str:
        sanitized = value.strip()
        if any(ch in sanitized for ch in "<>\"'"):
            raise ValueError("URL contains unsafe characters")

        parsed = urlparse(sanitized)
        if parsed.scheme not in {"http", "https"}:
            raise ValueError("URL must start with http or https")
        if parsed.netloc not in {"www.linkedin.com", "linkedin.com"}:
            raise ValueError("URL must be a LinkedIn URL")
        if not parsed.path.startswith("/in/"):
            raise ValueError("URL must be a LinkedIn public profile URL")
        return sanitized


class AnalyzeProfileResponse(BaseModel):
    score: int
    headline_score: int
    about_score: int
    experience_score: int
    skills_score: int
    keyword_score: int
    suggestions: List[str]
    improved_headline: str
    improved_about: str
    recruiter_feedback: str
