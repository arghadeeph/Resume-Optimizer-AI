from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.ai.ollama_client import OllamaAnalysisError
from app.core.database import get_db
from app.schemas.profile import AnalyzeProfileRequest, AnalyzeProfileResponse
from app.scraping.linkedin_scraper import scrape_linkedin_profile
from app.services.profile_analyzer import analyze_and_store_profile
from app.services.rate_limit import apply_rate_limit

router = APIRouter()


@router.post("/analyze-profile", response_model=AnalyzeProfileResponse)
async def analyze_profile(
    payload: AnalyzeProfileRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    apply_rate_limit(request)
    try:
        profile_data = await scrape_linkedin_profile(payload.profile_url)
        result = await analyze_and_store_profile(db, payload.profile_url, profile_data)
        return AnalyzeProfileResponse(**result)
    except OllamaAnalysisError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
