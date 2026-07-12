# Face & Product Recognition (Open Source)

[![Release](https://img.shields.io/github/v/release/Samukelo-Mkhonza/face-product-recognition?include_prereleases)](https://github.com/Samukelo-Mkhonza/face-product-recognition/releases)

A face-recognition and product-recognition application built entirely on
open-source models and libraries — no proprietary vision APIs (no AWS
Rekognition, Azure Face, Google Vision, etc.).

## What it does

- **Face recognition** — detect faces in an image/video frame, enroll known
  people, and identify or verify faces against the enrolled set.
- **Product recognition** — detect products in an image and match them
  against a catalog using visual similarity (embedding search), so new
  products can be added without retraining a classifier.

Backend is a FastAPI service (Python); the UI is a React + TypeScript app
(`frontend/`) that talks to it over HTTP.

## Status

🚧 Early stage — see [docs/PLAN.md](docs/PLAN.md) for the roadmap and current
phase. Planning docs land before implementation code, phase by phase.

## Documentation

| Doc | Purpose |
|---|---|
| [docs/PLAN.md](docs/PLAN.md) | Phased roadmap, milestones, acceptance criteria |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design and data flow |
| [docs/TECH_STACK.md](docs/TECH_STACK.md) | Every library/model used, with license |
| [docs/SETUP.md](docs/SETUP.md) | Local dev environment setup |
| [docs/API.md](docs/API.md) | REST API reference |

## Deployment

The UI (`frontend/`) deploys to GitHub Pages via
[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) on
every push to `main`. Because Pages only serves static files, the FastAPI
backend must be hosted separately (Docker image already provided) — set the
`VITE_API_BASE_URL` repository variable to its public URL so the Pages build
points at it. [render.yaml](render.yaml) is a ready-to-use blueprint for
deploying the backend on [Render](https://render.com) via *New → Blueprint*.
See [docs/SETUP.md](docs/SETUP.md) for details.

## Releases

Versioning, changelog, and GitHub Releases are automated with
[release-please](https://github.com/googleapis/release-please) based on
[Conventional Commits](https://www.conventionalcommits.org/) — see
[CONTRIBUTING.md](CONTRIBUTING.md#releases). See
[Releases](https://github.com/Samukelo-Mkhonza/face-product-recognition/releases)
for the changelog and downloadable tags once published.

## License

Project code is [MIT licensed](LICENSE). Some bundled models/libraries carry
different open-source licenses (notably AGPL-3.0 for the default object
detector) — see [docs/TECH_STACK.md](docs/TECH_STACK.md) for the full audit
before you deploy or redistribute.
