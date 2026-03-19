from __future__ import annotations

import io
import re
from typing import Dict, List, Optional

from fastapi import UploadFile
import logging

from app.schemas.analysis import ProfileData

logger = logging.getLogger(__name__)

SECTION_MAP = {
    "SUMMARY": "about",
    "PROFESSIONAL SUMMARY": "about",
    "ABOUT": "about",
    "PROFILE": "about",
    "OBJECTIVE": "about",
    "EXPERIENCE": "experience",
    "WORK EXPERIENCE": "experience",
    "PROFESSIONAL EXPERIENCE": "experience",
    "EMPLOYMENT": "experience",
    "SKILLS": "skills",
    "TECHNICAL SKILLS": "skills",
    "CORE SKILLS": "skills",
}


async def parse_resume_upload(upload: UploadFile) -> ProfileData:
    filename = (upload.filename or "resume").strip() or "resume"
    content = await upload.read()
    if not content:
        raise ValueError("Uploaded file is empty.")

    ext = _get_extension(filename)
    if ext == ".pdf":
        text = _extract_pdf_text(content)
    elif ext == ".docx":
        text = _extract_docx_text(content)
    elif ext == ".txt":
        text = _extract_txt_text(content)
    else:
        raise ValueError("Unsupported file type. Upload a PDF, DOCX, or TXT resume.")

    text = _normalize_text(text)
    if not text:
        raise ValueError("Unable to read text from the uploaded resume.")

    logger.info("Parsed resume text length=%s filename=%s", len(text), filename)

    sections = _extract_sections(text)
    return ProfileData(
        headline=sections["headline"],
        about=sections["about"],
        experience=sections["experience"],
        skills=sections["skills"],
    )


def _get_extension(filename: str) -> str:
    match = re.search(r"(\.[A-Za-z0-9]+)$", filename)
    return match.group(1).lower() if match else ""


def _extract_pdf_text(content: bytes) -> str:
    try:
        from PyPDF2 import PdfReader
    except ImportError as exc:
        raise ValueError("PDF support is not installed. Please install PyPDF2.") from exc

    reader = PdfReader(io.BytesIO(content))
    parts: List[str] = []
    for index, page in enumerate(reader.pages):
        page_text = page.extract_text() or ""
        logger.info("Parsed PDF page %s length=%s", index + 1, len(page_text))
        parts.append(page_text)
    return "\n".join(parts)


def _extract_docx_text(content: bytes) -> str:
    try:
        from docx import Document
    except ImportError as exc:
        raise ValueError("DOCX support is not installed. Please install python-docx.") from exc

    doc = Document(io.BytesIO(content))
    return "\n".join([paragraph.text for paragraph in doc.paragraphs])


def _extract_txt_text(content: bytes) -> str:
    try:
        return content.decode("utf-8")
    except UnicodeDecodeError:
        return content.decode("latin-1", errors="ignore")


def _normalize_text(text: str) -> str:
    text = text.replace("\r", "\n")
    lines = [line.strip() for line in text.splitlines()]
    return "\n".join([line for line in lines if line])


def _extract_sections(text: str) -> Dict[str, str]:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    headline = lines[0] if lines else ""

    buffers: Dict[str, List[str]] = {"about": [], "experience": [], "skills": []}
    active_section = None

    for line in lines[1:]:
        section = _match_section(line)
        if section:
            active_section = section
            continue
        if active_section in buffers:
            buffers[active_section].append(line)

    about = "\n".join(buffers["about"]).strip()
    experience = "\n".join(buffers["experience"]).strip()
    skills = "\n".join(buffers["skills"]).strip()

    if not experience:
        experience = "\n".join(lines).strip()

    return {
        "headline": headline,
        "about": about,
        "experience": experience,
        "skills": skills,
    }


def _match_section(line: str) -> Optional[str]:
    normalized = re.sub(r"[^A-Z ]+", "", line.upper()).strip()
    return SECTION_MAP.get(normalized)
