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
