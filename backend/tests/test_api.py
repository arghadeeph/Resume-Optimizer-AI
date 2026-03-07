from app.schemas.analysis import ProfileData


def test_analyze_profile_endpoint(client, monkeypatch):
    async def fake_scrape(_):
        return ProfileData(
            headline="Senior Backend Engineer",
            about="I build resilient API platforms with Python and cloud services.",
            experience="Built microservices at scale",
            skills="Python, FastAPI, Docker, PostgreSQL",
        )

    async def fake_analyze(db, profile_url, profile_data):
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
        }

    monkeypatch.setattr("app.routers.profile.scrape_linkedin_profile", fake_scrape)
    monkeypatch.setattr("app.routers.profile.analyze_and_store_profile", fake_analyze)

    payload = {"profile_url": "https://www.linkedin.com/in/john-doe"}
    response = client.post("/analyze-profile", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 88
    assert data["headline_score"] == 18
    assert "suggestions" in data


def test_invalid_url_rejected(client):
    response = client.post(
        "/analyze-profile", json={"profile_url": "https://example.com/profile"}
    )
    assert response.status_code == 422
