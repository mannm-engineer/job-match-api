LinkedIn Job Scraper (MVP)

Overview
- Python + Playwright scraper that logs into LinkedIn, performs a single configured search, and stores job summaries in Postgres.
- FastAPI exposes /jobs, /run-now, /health. /jobs returns job rows with URL only.
- Kubernetes: Deployment for API, CronJob runs scraper hourly.

Defaults
- Docker image: linkedin-scraper:latest
- K8s namespace: default
- Cron frequency: hourly

Security & ToS
- This solution automates a LinkedIn account. That can violate LinkedIn ToS. Use a dedicated account and proceed at your own risk.
- Store credentials in k8s Secrets and never commit them.

Quick start (local dev)
1. Install dependencies: Python 3.11, pip install -r requirements.txt
2. Run Postgres (local) and set DATABASE_URL env var (eg postgres://user:pass@localhost:5432/dbname)
3. Set LINKEDIN_USER, LINKEDIN_PASS, SEARCH_KEYWORD, SEARCH_LOCATION env vars.
4. Run scraper: python scraper.py
5. Run API: uvicorn main:app --host 0.0.0.0 --port 8000

Kubernetes
- Update k8s/secrets.yaml with real secrets and apply manifests in k8s/.

Files
- app/scraper.py - scraper script
- app/main.py - FastAPI app
- app/db.py - DB models
- Dockerfile
- k8s/ (manifests)

Contact
- I built this scaffold; tell me if you want me to tweak the search parameters, make multiple searches, or add a lightweight UI.
