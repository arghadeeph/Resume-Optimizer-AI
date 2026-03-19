import json

from sqlalchemy.orm import Session

from app.ai.openai_client import OpenAIAnalysisError, analyze_resume_with_openai
from app.core.config import settings
from app.models.analysis import Analysis
from app.schemas.analysis import ProfileData
from app.services.keyword_analysis import keyword_match_score


async def analyze_and_store_resume(db: Session, resume_name: str, profile_data: ProfileData) -> dict:
    combined_text = " ".join(
        [profile_data.headline, profile_data.about, profile_data.experience, profile_data.skills]
    )
    keyword_score = keyword_match_score(combined_text)

    payload = {
        "headline": profile_data.headline,
        "about": profile_data.about,
        "experience": profile_data.experience,
        "skills": profile_data.skills,
    }

    try:
        ai_data = await analyze_resume_with_openai(payload)
    except OpenAIAnalysisError:
        if not settings.allow_ai_fallback:
            raise
        ai_data = _fallback_analysis(profile_data, keyword_score)

    # Keep deterministic keyword score from NLP pipeline.
    ai_data["keyword_score"] = keyword_score

    total_score = (
        ai_data["headline_score"]
        + ai_data["about_score"]
        + ai_data["experience_score"]
        + ai_data["skills_score"]
        + ai_data["keyword_score"]
    )
    total_score = max(0, min(100, total_score))

    record = Analysis(
        profile_url=resume_name,
        headline=profile_data.headline,
        about=profile_data.about,
        experience=profile_data.experience,
        skills=profile_data.skills,
        total_score=total_score,
        headline_score=ai_data["headline_score"],
        about_score=ai_data["about_score"],
        experience_score=ai_data["experience_score"],
        skills_score=ai_data["skills_score"],
        keyword_score=ai_data["keyword_score"],
        improved_headline=ai_data["improved_headline"],
        improved_about=ai_data["improved_about"],
        suggestions=json.dumps(ai_data["suggestions"]),
        recruiter_feedback=ai_data["recruiter_feedback"],
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "score": total_score,
        "headline_score": ai_data["headline_score"],
        "about_score": ai_data["about_score"],
        "experience_score": ai_data["experience_score"],
        "skills_score": ai_data["skills_score"],
        "keyword_score": ai_data["keyword_score"],
        "suggestions": ai_data["suggestions"],
        "improved_headline": ai_data["improved_headline"],
        "improved_about": ai_data["improved_about"],
        "recruiter_feedback": ai_data["recruiter_feedback"],
        "experience_level": ai_data.get("experience_level", ""),
        "industry": ai_data.get("industry", ""),
        "role": ai_data.get("role", ""),
        "issues_summary": ai_data.get("issues_summary", ""),
        "improvements_summary": ai_data.get("improvements_summary", ""),
        "industry_keywords": ai_data.get("industry_keywords", []),
        "section_feedback": ai_data.get("section_feedback", {}),
    }


def _fallback_analysis(profile_data: ProfileData, keyword_score: int) -> dict:
    headline_score = 20 if len(profile_data.headline) > 40 else 12 if profile_data.headline else 0
    about_score = 20 if len(profile_data.about) > 250 else 12 if profile_data.about else 0
    exp_score = 25 if len(profile_data.experience) > 300 else 15 if profile_data.experience else 0
    skills_count = len([s for s in profile_data.skills.split(",") if s.strip()])
    skills_score = min(15, skills_count * 2) if profile_data.skills else 0

    suggestions = [
        "Add quantified outcomes to experience bullets (for example: improved latency by 35%).",
        "Increase role-specific keywords in headline/summary for recruiter search ranking.",
        "Expand skills with cloud, architecture, and testing stack details.",
    ]

    return {
        "headline_score": headline_score,
        "about_score": about_score,
        "experience_score": exp_score,
        "skills_score": skills_score,
        "keyword_score": keyword_score,
        "improved_headline": profile_data.headline
        or "Software Engineer | Backend Systems | APIs | Cloud",
        "improved_about": profile_data.about
        or "Engineer focused on backend systems, APIs, and scalable software delivery.",
        "suggestions": suggestions,
        "recruiter_feedback": "Fallback analysis used because AI model service was unavailable.",
    }
