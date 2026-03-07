from __future__ import annotations

import re
from functools import lru_cache
from typing import Set

import spacy

RECRUITER_KEYWORDS = {
    "python",
    "fastapi",
    "api",
    "microservices",
    "aws",
    "docker",
    "kubernetes",
    "ci/cd",
    "postgresql",
    "sql",
    "typescript",
    "react",
    "next.js",
    "machine learning",
    "llm",
    "nlp",
    "testing",
    "pytest",
    "agile",
    "system design",
}


@lru_cache(maxsize=1)
def get_nlp():
    try:
        return spacy.load("en_core_web_sm")
    except OSError:
        return spacy.blank("en")


def extract_keywords(text: str) -> Set[str]:
    normalized_text = re.sub(r"\s+", " ", text.lower()).strip()
    if not normalized_text:
        return set()

    nlp = get_nlp()
    doc = nlp(normalized_text)

    keywords = set()
    for token in doc:
        if token.is_stop or token.is_punct or not token.text.strip():
            continue
        if len(token.text) > 2:
            keywords.add(token.lemma_.lower() if token.lemma_ else token.text.lower())

    for kw in RECRUITER_KEYWORDS:
        if kw in normalized_text:
            keywords.add(kw)
    return keywords


def keyword_match_score(text: str) -> int:
    found = extract_keywords(text)
    if not found:
        return 0
    matches = len(found.intersection(RECRUITER_KEYWORDS))
    score = int((matches / len(RECRUITER_KEYWORDS)) * 20)
    return max(0, min(20, score))
