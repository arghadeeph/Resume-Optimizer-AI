from __future__ import annotations

import json
import re
from typing import Any, Dict

import httpx

from app.core.config import settings


class OllamaAnalysisError(Exception):
    pass


async def analyze_profile_with_ollama(profile_payload: Dict[str, str]) -> Dict[str, Any]:
    prompt = _build_prompt(profile_payload)
    async with httpx.AsyncClient(timeout=90.0) as client:
        response = await client.post(
            f"{settings.ollama_url}/api/generate",
            json={"model": settings.ollama_model, "prompt": prompt, "stream": False},
        )
    response.raise_for_status()
    raw_text = response.json().get("response", "")
    parsed = _parse_json_response(raw_text)
    return _normalize_response(parsed)


def _build_prompt(payload: Dict[str, str]) -> str:
    return f"""
You are a LinkedIn recruiter optimization assistant.
Analyze this profile and return STRICT JSON only.

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
  "recruiter_feedback": "string"
}}

Profile data:
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
            raise OllamaAnalysisError("Model response did not contain valid JSON")
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError as exc:
            raise OllamaAnalysisError("Unable to parse model JSON response") from exc


def _bounded_int(value: Any, min_val: int, max_val: int) -> int:
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        parsed = min_val
    return max(min_val, min(max_val, parsed))


def _normalize_response(data: Dict[str, Any]) -> Dict[str, Any]:
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
    }
