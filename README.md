# Resume Optimizer AI

AI SaaS application that analyzes a resume and returns recruiter-oriented improvements with AI-driven scoring and tailored feedback.

## Architecture

- Frontend: Next.js + TypeScript + TailwindCSS
- Backend: FastAPI + spaCy + OpenAI integration
- Database: PostgreSQL (SQLAlchemy)
- AI runtime: OpenAI API
- Deployment: Docker + docker-compose

Flow:

1. User uploads a resume from the frontend
2. Backend parses resume text and rate-limits requests
3. spaCy keyword analyzer scores recruiter keyword alignment
4. OpenAI generates section scores, rewritten content, and suggestions
5. OpenAI also classifies experience level and industry, and generates structured feedback
6. Backend computes total score (0-100), stores analysis, and returns response

## Project Tree

```text
linkedin-optimizer/
  backend/
    app/
      ai/
      core/
      models/
      routers/
      schemas/
      scraping/
      services/
      main.py
    tests/
    requirements.txt
    Dockerfile
  frontend/
    app/
      dashboard/
      layout.tsx
      page.tsx
    components/
    services/
    utils/
    __tests__/
    package.json
    Dockerfile
  .github/workflows/ci.yml
  docker-compose.yml
  README.md
```

## Backend API

`POST /analyze-resume`

Request:

`multipart/form-data` with a single `file` field (PDF, DOCX, or TXT).

Response:

```json
{
  "score": 86,
  "headline_score": 17,
  "about_score": 18,
  "experience_score": 22,
  "skills_score": 13,
  "keyword_score": 16,
  "suggestions": ["Add measurable impact in experience bullets"],
  "improved_headline": "Senior Software Engineer | FastAPI | AWS | Platform",
  "improved_about": "...",
  "recruiter_feedback": "...",
  "experience_level": "mid",
  "industry": "software",
  "role": "backend engineer",
  "issues_summary": "Short summary of key issues",
  "improvements_summary": "Short summary of high-impact improvements",
  "industry_keywords": ["microservices", "API design", "AWS"],
  "section_feedback": {
    "headline": { "good": ["Clear title"], "ok": ["Short"], "needs_improvement": ["Add tech stack"] },
    "about": { "good": ["Readable"], "ok": ["Generic"], "needs_improvement": ["Add outcomes"] },
    "experience": { "good": ["Relevant roles"], "ok": ["Short bullets"], "needs_improvement": ["Quantify impact"] },
    "skills": { "good": ["Core stack"], "ok": ["Missing cloud"], "needs_improvement": ["Add AWS"] },
    "keywords": { "good": ["Some matches"], "ok": ["Low density"], "needs_improvement": ["Add role keywords"] }
  }
}
```

## Scoring Rules

- Headline: 20
- About: 20
- Experience: 25
- Skills: 15
- Keywords: 20
- Total: 100

## Local Run (without Docker)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Docker Run

```bash
cd linkedin-optimizer
docker-compose up --build
```

Services:

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- PostgreSQL: localhost:5432

## Tests

Backend:

```bash
cd backend
pytest
```

Frontend:

```bash
cd frontend
npm test -- --runInBand
```

## Deployment Notes

1. Use managed PostgreSQL in production.
2. Configure OpenAI API keys and usage limits for production.
3. Restrict CORS to production domains.
4. Add auth and per-user usage quotas before public launch.
