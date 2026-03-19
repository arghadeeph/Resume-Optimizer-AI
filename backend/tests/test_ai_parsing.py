from app.ai.openai_client import _normalize_response, _parse_json_response


def test_parse_json_response_plain_json():
    raw = '{"headline_score": 10, "suggestions": ["A"]}'
    parsed = _parse_json_response(raw)
    assert parsed["headline_score"] == 10


def test_parse_json_response_markdown_wrapped():
    raw = "Output:\n```json\n{\"headline_score\": 12}\n```"
    parsed = _parse_json_response(raw)
    assert parsed["headline_score"] == 12


def test_normalize_response_bounds_scores():
    normalized = _normalize_response(
        {
            "headline_score": 999,
            "about_score": -2,
            "experience_score": 20,
            "skills_score": 1,
            "keyword_score": 30,
            "suggestions": ["Improve headline"],
        }
    )
    assert normalized["headline_score"] == 20
    assert normalized["about_score"] == 0
    assert normalized["keyword_score"] == 20
