import json

from sqlalchemy.orm import Session

from app.ai.ollama_client import analyze_profile_with_ollama
from app.models.analysis import Analysis
from app.schemas.analysis import ProfileData
from app.services.keyword_analysis import keyword_match_score


async def analyze_and_store_profile(db: Session, profile_url: str, profile_data: ProfileData) -> dict:
    combined_text = " ".join(
        [profile_data.headline, profile_data.about, profile_data.experience, profile_data.skills]
    )
    keyword_score = keyword_match_score(combined_text)

    ai_data = await analyze_profile_with_ollama(
        {
            "headline": profile_data.headline,
            "about": profile_data.about,
            "experience": profile_data.experience,
            "skills": profile_data.skills,
        }
    )

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
        profile_url=profile_url,
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
    }
