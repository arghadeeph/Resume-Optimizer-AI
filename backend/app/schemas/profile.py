from __future__ import annotations

from pydantic import BaseModel
from typing import List


class AnalyzeResumeResponse(BaseModel):
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
    experience_level: str
    industry: str
    role: str
    issues_summary: str
    improvements_summary: str
    industry_keywords: List[str]
    section_feedback: dict
