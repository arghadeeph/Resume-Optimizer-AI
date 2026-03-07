# LinkedIn AI Profile Optimizer

AI SaaS application that analyzes a public LinkedIn profile and returns recruiter-oriented improvements.

## Architecture

- Frontend: Next.js + TypeScript + TailwindCSS
- Backend: FastAPI + Playwright + spaCy + Ollama integration
- Database: PostgreSQL (SQLAlchemy)
- Local AI runtime: Ollama (`llama3`)
- Deployment: Docker + docker-compose

Flow:

1. User submits LinkedIn profile URL from frontend
2. Backend validates URL and rate-limits requests
3. Playwright scraper extracts headline, about, experience, skills
4. spaCy keyword analyzer scores recruiter keyword alignment
5. Ollama generates section scores, rewritten content, and suggestions
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

`POST /analyze-profile`

Request:

```json
{
  "profile_url": "https://www.linkedin.com/in/example"
}
```

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
  "recruiter_feedback": "..."
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
playwright install chromium
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
- Ollama: http://localhost:11434
- PostgreSQL: localhost:5432

After containers are up, pull model once:

```bash
docker exec -it linkedin-optimizer-ollama ollama pull llama3
```

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
2. Run Ollama on dedicated CPU/GPU node.
3. Restrict CORS to production domains.
4. Add auth and per-user usage quotas before public launch.
