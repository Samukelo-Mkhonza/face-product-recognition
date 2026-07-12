# Face & Product Recognition (Open Source)

A face-recognition and product-recognition application built entirely on
open-source models and libraries — no proprietary vision APIs (no AWS
Rekognition, Azure Face, Google Vision, etc.).

## What it does

- **Face recognition** — detect faces in an image/video frame, enroll known
  people, and identify or verify faces against the enrolled set.
- **Product recognition** — detect products in an image and match them
  against a catalog using visual similarity (embedding search), so new
  products can be added without retraining a classifier.

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

## License

Project code is [MIT licensed](LICENSE). Some bundled models/libraries carry
different open-source licenses (notably AGPL-3.0 for the default object
detector) — see [docs/TECH_STACK.md](docs/TECH_STACK.md) for the full audit
before you deploy or redistribute.
