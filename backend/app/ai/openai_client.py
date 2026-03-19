from __future__ import annotations

import json
import re
from typing import Any, Dict, List

import httpx
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class OpenAIAnalysisError(Exception):
    pass


async def analyze_resume_with_openai(profile_payload: Dict[str, str]) -> Dict[str, Any]:
    prompt = _build_prompt(profile_payload)
    if not settings.openai_api_key:
        raise OpenAIAnalysisError("OPENAI_API_KEY is not set.")
    try:
        async with httpx.AsyncClient(timeout=90.0) as client:
            response = await client.post(
                f"{settings.openai_base_url}/responses",
                headers={
                    "Authorization": f"Bearer {settings.openai_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": settings.openai_model,
                    "input": prompt,
                    "temperature": 0.2,
                    "text": {"format": {"type": "json_object"}},
                },
            )
        response.raise_for_status()
        raw_text = _extract_output_text(response.json())
        parsed = _parse_json_response(raw_text)
        return _normalize_response(parsed)
    except httpx.HTTPStatusError as exc:
        status = exc.response.status_code if exc.response else "unknown"
        body = ""
        try:
            body = exc.response.text if exc.response else ""
        except Exception:
            body = ""
        logger.error("OpenAI request failed. Status=%s Body=%s", status, body)
        raise OpenAIAnalysisError("AI service is unavailable. Check OpenAI status.") from exc
    except httpx.HTTPError as exc:
        logger.error("OpenAI request error: %s", exc)
        raise OpenAIAnalysisError("AI service is unavailable. Check OpenAI status.") from exc


def _extract_output_text(payload: Dict[str, Any]) -> str:
    output_text = payload.get("output_text")
    if isinstance(output_text, str) and output_text.strip():
        return output_text

    output_items: List[Dict[str, Any]] = payload.get("output") or []
    collected: List[str] = []
    for item in output_items:
        if item.get("type") != "message":
            continue
        for content in item.get("content") or []:
            if content.get("type") == "output_text" and content.get("text"):
                collected.append(str(content["text"]))

    if not collected:
        raise OpenAIAnalysisError("Model response did not contain text output")

    return "\n".join(collected)


def _build_prompt(payload: Dict[str, str]) -> str:
    return f"""
You are a resume optimization assistant.
Analyze this resume content and return STRICT JSON only.

Scoring caps:
- headline_score max 20
- about_score max 20
- experience_score max 25
- skills_score max 15
- keyword_score max 20

Return this JSON structure:
{{
  "headline_score": number,
  "about_score": number,
  "experience_score": number,
  "skills_score": number,
  "keyword_score": number,
  "improved_headline": "string",
  "improved_about": "string",
  "suggestions": ["string", "string"],
  "recruiter_feedback": "string",
  "experience_level": "student|junior|mid|senior",
  "industry": "string",
  "role": "string",
  "issues_summary": "string",
  "improvements_summary": "string",
  "industry_keywords": ["string", "string"],
  "section_feedback": {{
    "headline": {{ "good": ["string"], "ok": ["string"], "needs_improvement": ["string"] }},
    "about": {{ "good": ["string"], "ok": ["string"], "needs_improvement": ["string"] }},
    "experience": {{ "good": ["string"], "ok": ["string"], "needs_improvement": ["string"] }},
    "skills": {{ "good": ["string"], "ok": ["string"], "needs_improvement": ["string"] }},
    "keywords": {{ "good": ["string"], "ok": ["string"], "needs_improvement": ["string"] }}
  }}
}}

Resume data:
headline: {payload.get("headline", "")}
about: {payload.get("about", "")}
experience: {payload.get("experience", "")}
skills: {payload.get("skills", "")}
""".strip()


def _parse_json_response(text: str) -> Dict[str, Any]:
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if not match:
            raise OpenAIAnalysisError("Model response did not contain valid JSON")
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError as exc:
            raise OpenAIAnalysisError("Unable to parse model JSON response") from exc


def _bounded_int(value: Any, min_val: int, max_val: int) -> int:
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        parsed = min_val
    return max(min_val, min(max_val, parsed))


def _normalize_response(data: Dict[str, Any]) -> Dict[str, Any]:
    section_feedback = data.get("section_feedback") or {}

    def _normalize_section(section_key: str) -> Dict[str, List[str]]:
        raw = section_feedback.get(section_key) or {}
        return {
            "good": [str(item) for item in (raw.get("good") or [])],
            "ok": [str(item) for item in (raw.get("ok") or [])],
            "needs_improvement": [str(item) for item in (raw.get("needs_improvement") or [])],
        }

    return {
        "headline_score": _bounded_int(data.get("headline_score"), 0, 20),
        "about_score": _bounded_int(data.get("about_score"), 0, 20),
        "experience_score": _bounded_int(data.get("experience_score"), 0, 25),
        "skills_score": _bounded_int(data.get("skills_score"), 0, 15),
        "keyword_score": _bounded_int(data.get("keyword_score"), 0, 20),
        "improved_headline": str(data.get("improved_headline") or ""),
        "improved_about": str(data.get("improved_about") or ""),
        "suggestions": [str(item) for item in (data.get("suggestions") or [])],
        "recruiter_feedback": str(data.get("recruiter_feedback") or ""),
        "experience_level": str(data.get("experience_level") or ""),
        "industry": str(data.get("industry") or ""),
        "role": str(data.get("role") or ""),
        "issues_summary": str(data.get("issues_summary") or ""),
        "improvements_summary": str(data.get("improvements_summary") or ""),
        "industry_keywords": [str(item) for item in (data.get("industry_keywords") or [])],
        "section_feedback": {
            "headline": _normalize_section("headline"),
            "about": _normalize_section("about"),
            "experience": _normalize_section("experience"),
            "skills": _normalize_section("skills"),
            "keywords": _normalize_section("keywords"),
        },
    }
