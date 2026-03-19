import asyncio

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from sqlalchemy.orm import Session

from app.ai.openai_client import OpenAIAnalysisError
from app.core.database import get_db
from app.schemas.profile import AnalyzeResumeResponse
from app.services.profile_analyzer import analyze_and_store_resume
from app.services.rate_limit import apply_rate_limit
from app.services.resume_parser import parse_resume_upload

router = APIRouter()


@router.post("/analyze-resume", response_model=AnalyzeResumeResponse)
async def analyze_resume(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    apply_rate_limit(request)
    try:
        try:
            profile_data = await asyncio.wait_for(parse_resume_upload(file), timeout=15.0)
            result = await asyncio.wait_for(
                analyze_and_store_resume(db, file.filename or "resume", profile_data),
                timeout=60.0,
            )
        except asyncio.TimeoutError as exc:
            raise HTTPException(
                status_code=504,
                detail="Resume analysis timed out. Try a smaller file or simpler format.",
            ) from exc
        return AnalyzeResumeResponse(**result)
    except OpenAIAnalysisError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Resume parsing failed. Ensure the file is a readable PDF, DOCX, or TXT.",
        ) from exc
