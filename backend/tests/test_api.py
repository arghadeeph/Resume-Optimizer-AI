from app.schemas.analysis import ProfileData


def test_analyze_resume_endpoint(client, monkeypatch):
    async def fake_parse(_):
        return ProfileData(
            headline="Senior Backend Engineer",
            about="I build resilient API platforms with Python and cloud services.",
            experience="Built microservices at scale",
            skills="Python, FastAPI, Docker, PostgreSQL",
        )

    async def fake_analyze(db, resume_name, profile_data):
        return {
            "score": 88,
            "headline_score": 18,
            "about_score": 17,
            "experience_score": 21,
            "skills_score": 14,
            "keyword_score": 18,
            "suggestions": ["Add quantified achievements"],
            "improved_headline": "Senior Backend Engineer | FastAPI | Cloud Systems",
            "improved_about": "I design API-first backend systems that scale reliably.",
            "recruiter_feedback": "Strong fit for backend platform roles.",
            "experience_level": "mid",
            "industry": "software",
            "role": "backend engineer",
            "issues_summary": "Missing quantified impact.",
            "improvements_summary": "Add metrics and tighten summary.",
            "industry_keywords": ["microservices", "AWS"],
            "section_feedback": {
                "headline": {"good": ["Clear title"], "ok": ["Short"], "needs_improvement": ["Add stack"]},
                "about": {"good": ["Readable"], "ok": ["Generic"], "needs_improvement": ["Add outcomes"]},
                "experience": {"good": ["Relevant roles"], "ok": ["Short bullets"], "needs_improvement": ["Quantify impact"]},
                "skills": {"good": ["Core stack"], "ok": ["Missing cloud"], "needs_improvement": ["Add AWS"]},
                "keywords": {"good": ["Some matches"], "ok": ["Low density"], "needs_improvement": ["Add role keywords"]},
            },
        }

    monkeypatch.setattr("app.routers.profile.parse_resume_upload", fake_parse)
    monkeypatch.setattr("app.routers.profile.analyze_and_store_resume", fake_analyze)

    response = client.post(
        "/analyze-resume",
        files={"file": ("resume.txt", b"Resume content", "text/plain")},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 88
    assert data["headline_score"] == 18
    assert "suggestions" in data


def test_invalid_file_rejected(client):
    response = client.post(
        "/analyze-resume",
        files={"file": ("resume.exe", b"bad", "application/octet-stream")},
    )
    assert response.status_code == 400
