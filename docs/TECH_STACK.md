# Tech Stack & License Audit

Every model, library, and tool used in this project, with its license.
"Open source resources only" is a hard constraint for this project — nothing
here should be a proprietary/paid API. Re-check this table in Phase 8 against
what's actually installed (`pip licenses` or similar) before any public
release.

## Core application

| Component | Choice | License | Notes |
|---|---|---|---|
| Language | Python 3.11+ | PSF | |
| API framework | FastAPI | MIT | |
| ASGI server | Uvicorn | BSD-3-Clause | |
| Frontend | React 18 + Vite + TypeScript | MIT | build output served as static files by FastAPI in production |
| Metadata storage | SQLite (stdlib) | Public domain | |
| Vector index | FAISS | MIT | Meta AI |
| Containerization | Docker | Apache-2.0 | tooling, not bundled in image |

## Face pipeline

| Component | Choice | License | Notes |
|---|---|---|---|
| Face detection | MediaPipe Face Detector | Apache-2.0 | Google; used via DeepFace's `mediapipe` detector backend |
| Face embedding | DeepFace (Facenet512 backend) | MIT (DeepFace); TensorFlow: Apache-2.0 | CPU-friendly, 512-d embeddings, pure-Python install (no C++ toolchain needed, unlike dlib) |

## Product pipeline

| Component | Choice | License | Notes |
|---|---|---|---|
| Object detection | YOLOv8n (Ultralytics) | **AGPL-3.0** | See "License flag" below |
| Product embedding | CLIP `ViT-B/32` (OpenAI weights) | MIT (code); model weights released for research **and** general use | loaded via `open_clip_torch` (MIT) — a pip-installable, actively maintained package that ships the same OpenAI-pretrained `ViT-B-32` weights, rather than installing OpenAI's `clip` package from GitHub directly |

## License flag: YOLOv8 (AGPL-3.0)

AGPL-3.0 is fully open source but **copyleft**: if this app is run as a
network service using an AGPL-licensed component, AGPL's terms generally
require making the complete corresponding source available to users of that
service. That's compatible with this being a public, source-available repo,
but worth knowing before any closed-source or commercial fork.

**Apache-2.0 alternative:** swap in RT-DETR (Apache-2.0) or another
permissively-licensed detector in Phase 3 if copyleft is a problem. Tracked
as an open decision in [PLAN.md](PLAN.md).

## Explicitly avoided

- AWS Rekognition, Azure Face API, Google Cloud Vision — proprietary, paid,
  closed-source.
- Any vendor SDK that requires an API key/billing account.
- `dlib`/`face_recognition` — open source, but dropped for a practical
  reason, not a licensing one: no official Windows wheels, requires CMake
  + a C++ toolchain to build from source. See the face-embedding row above
  and [PLAN.md](PLAN.md)'s "Open decisions" section.

## Dataset notes

- No public face datasets (e.g. LFW) are bundled or auto-downloaded by
  default, to sidestep their individual usage/consent terms — enrollment
  data comes from images the user supplies themselves.
- Any product-image sample set added in Phase 1 must have a license that
  permits redistribution in this repo (e.g. CC0/CC-BY) — record it here
  when added.
