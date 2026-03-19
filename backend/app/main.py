from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict

from app.core.config import settings
from app.core.database import Base, engine
from app.routers.profile import router as profile_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s - %(message)s",
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name)


def _warn_missing_resume_deps() -> None:
    try:
        import PyPDF2  # noqa: F401
    except ImportError:
        logging.warning("Missing PyPDF2. PDF resume parsing will be disabled.")

    try:
        import docx  # noqa: F401
    except ImportError:
        logging.warning("Missing python-docx. DOCX resume parsing will be disabled.")


_warn_missing_resume_deps()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profile_router)


@app.get("/health")
def healthcheck() -> Dict[str, str]:
    return {"status": "ok"}
