# Local Development Setup

> This will fill in as Phase 1 lands. Current state: repo scaffold only, no
> installable app yet.

## Prerequisites

- Python 3.11+
- Docker (optional, for the containerized workflow)
- Git

## Planned quickstart (Phase 1)

```bash
git clone https://github.com/Samukelo-Mkhonza/face-product-recognition.git
cd face-product-recognition
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

## Planned Docker quickstart (Phase 1)

```bash
docker compose up --build
```

## Environment variables

None required yet. Will be documented here as they're introduced (e.g.
model paths, similarity thresholds, data directory overrides) — copy
`.env.example` to `.env` once that file exists.

## Running tests

```bash
pytest
```

(Test suite lands in Phase 2 onward — see [PLAN.md](PLAN.md).)

## Deployment

**Frontend (GitHub Pages)** — [.github/workflows/deploy-pages.yml](../.github/workflows/deploy-pages.yml)
builds `frontend/` and publishes it on every push to `main`. One-time setup:

1. Repo *Settings → Pages → Build and deployment → Source* = "GitHub Actions".
2. Repo *Settings → Secrets and variables → Actions → Variables*, add
   `VITE_API_BASE_URL` = your backend's public URL (see below). Without it,
   the deployed UI loads but every request fails since there's no same-origin
   backend to talk to.
3. Push to `main`, or run the workflow manually from the Actions tab.

The site is served at `https://<owner>.github.io/<repo>/`.

**Backend (Render)** — [render.yaml](../render.yaml) is a blueprint that
builds the existing [Dockerfile](../Dockerfile). In the Render dashboard:
*New → Blueprint*, point it at this repo, and deploy. Then:

1. Set the service's `CORS_ORIGINS` env var to your Pages origin (e.g.
   `https://<owner>.github.io`, no path) so the browser can call it.
2. Copy the service's `onrender.com` URL into the `VITE_API_BASE_URL`
   repository variable above and re-run the Pages workflow.

The blueprint uses Render's free plan: no persistent disk, so enrolled
faces/products in `/app/data` reset on every redeploy/restart, and the
service spins down after 15 min idle (first request after that is slow, or
briefly errors while it wakes up). For persistence and no cold starts, add
a paid `plan: starter` and a `disk:` block mounted at `/app/data` in
[render.yaml](../render.yaml). Any other Docker host (Fly.io, a VM, Cloud
Run) works the same way: build the image, expose port 8000, set
`CORS_ORIGINS`.
