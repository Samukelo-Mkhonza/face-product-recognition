# Project Plan

This is the phase-by-phase roadmap. Each phase has a goal, deliverables, and
acceptance criteria. Work proceeds phase by phase — implementation code for a
phase doesn't start until its planning is reflected here and in
[ARCHITECTURE.md](ARCHITECTURE.md).

Status legend: ✅ done · 🚧 in progress · ⬜ not started

## Phase 0 — Project Initialization ✅

**Goal:** Repo exists, scaffolding and planning docs are in place.

- [x] GitHub repository created (public, MIT license)
- [x] Docs scaffold: PLAN.md, ARCHITECTURE.md, TECH_STACK.md, SETUP.md, API.md
- [x] CI skeleton (GitHub Actions) and issue templates
- [x] .gitignore tuned for Python + model/data artifacts

**Acceptance:** repo is cloneable and this file renders correctly on GitHub.

## Phase 1 — Environment & Data Setup ⬜

**Goal:** A contributor can clone the repo and get a working dev environment
in under 10 minutes.

- [ ] `requirements.txt` + `requirements-dev.txt` with pinned versions
- [ ] Dockerfile + `docker-compose.yml` for a reproducible environment
      (backend API + frontend dev server)
- [ ] Sample/test data: a handful of self-supplied face images for
      enrollment testing (see `tests/fixtures/faces/README.md`), and
      synthetic generated images standing in for products so the test
      suite needs no scraped or licensed-restricted images
- [ ] Pre-commit hooks: `ruff` (lint) + `black` (format)

**Acceptance:** `docker compose up` serves a health-check endpoint; running
the app locally with `pip install -r requirements.txt` works on a clean venv.

## Phase 2 — Face Detection & Recognition MVP ⬜

**Goal:** Given an image, detect faces and identify them against an enrolled
set, via a Python module (no API/UI yet).

- [ ] Face detection using MediaPipe Face Detector (via DeepFace's
      `mediapipe` detector backend)
- [ ] Face embedding via DeepFace (Facenet512 backend)
- [ ] Enrollment: store `{name, embedding}` locally (pickle/SQLite for now)
- [ ] Matching: nearest-neighbor search over enrolled embeddings with a
      configurable distance threshold
- [ ] Unit tests covering: no-face image, one known face, one unknown face,
      multiple faces in one frame

**Acceptance:** a CLI script `enroll.py` and `identify.py` work end-to-end on
sample images with >90% correct identification on the test set.

## Phase 3 — Product Detection & Recognition MVP ⬜

**Goal:** Given an image, detect product-like objects and match each crop
against a product catalog via visual similarity.

- [ ] Object detection using YOLOv8n (pretrained COCO weights initially;
      document how to fine-tune on a custom product class later)
- [ ] Per-crop embedding via CLIP (`ViT-B/32`)
- [ ] Catalog: `{product_id, name, embedding, reference_image}`
- [ ] Matching: cosine similarity search over catalog embeddings, top-k
      results with confidence scores
- [ ] Unit tests covering: empty image, one product, multiple products,
      product not in catalog (should report "unknown", not a false match)

**Acceptance:** CLI scripts `add_product.py` and `recognize.py` work
end-to-end; catalog of 10+ sample products is correctly matched >85% of the
time on held-out photos of the same items.

## Phase 4 — Unified API ⬜

**Goal:** Expose both pipelines behind one FastAPI service.

- [ ] `POST /faces/enroll` — register a new known face
- [ ] `POST /faces/identify` — identify faces in an uploaded image
- [ ] `POST /products` — add a product to the catalog
- [ ] `POST /products/recognize` — recognize products in an uploaded image
- [ ] SQLite for metadata, FAISS index (persisted to disk) for embeddings
- [ ] Full endpoint contract documented in [API.md](API.md)

**Acceptance:** `docker compose up` + `curl` against every endpoint above
returns correct, documented responses; OpenAPI docs render at `/docs`.

## Phase 5 — React Web UI ⬜

**Goal:** A non-technical user can try the app without curl.

- [ ] React + Vite (TypeScript) app: upload image → see bounding boxes +
      labels for both faces and products, drawn over the image on a canvas
- [ ] Enrollment/catalog-management screens (add face, add product)
- [ ] Talks to the FastAPI service over HTTP (CORS enabled for local dev)

**Acceptance:** a fresh user can enroll a face, add a product, and get a
correct identification through the UI alone.

> Originally planned as a Streamlit app; switched to React per project
> requirements. In production, FastAPI serves the built React static
> assets from the same container (see Phase 7).

## Phase 6 — Testing & CI ⬜

**Goal:** Regressions are caught automatically.

- [ ] `pytest` suite covering detection, recognition, and API layers
      (target: meaningful coverage of core logic, not a raw % target)
- [ ] GitHub Actions: lint + test on every PR
- [ ] Basic performance benchmark logged (FPS / latency on CPU) so
      regressions in speed are visible over time

**Acceptance:** CI is green on `main`; a broken PR is blocked automatically.

## Phase 7 — Packaging & Deployment ⬜

**Goal:** The app can be deployed as a single container.

- [ ] Multi-stage Dockerfile (slim runtime image)
- [ ] Deployment doc: env vars, volumes for persisted data/models, resource
      requirements
- [ ] Optional: GPU-accelerated variant documented (CUDA base image) for
      users who have a GPU

**Acceptance:** `docker run` on a clean machine serves the full API + UI
with no manual setup steps beyond providing config.

## Phase 8 — Polish & License Audit ⬜

**Goal:** Ready to share publicly with confidence.

- [ ] Re-verify every model/library license in TECH_STACK.md against what's
      actually bundled/downloaded at runtime
- [x] CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md, PR template,
      CODEOWNERS, dependabot.yml (added ahead of schedule, see repo root
      and `.github/`)
- [ ] README demo GIF/screenshot
- [ ] Tag `v0.1.0` release

---

## Open decisions to revisit

- **Object detector license:** default is YOLOv8n (AGPL-3.0 — fully open
  source but copyleft). Switch to an Apache-2.0 detector (e.g. RT-DETR) in
  Phase 3 if AGPL's copyleft terms are a problem for how this gets
  distributed. See [TECH_STACK.md](TECH_STACK.md).
- **Face embedding library (resolved):** originally `dlib`/`face_recognition`,
  switched to DeepFace (Facenet512 backend) because `dlib` has no official
  Windows wheels and requires a C++ toolchain to build — a real risk to the
  "clone and `pip install`" acceptance criterion in [SETUP.md](SETUP.md).
  DeepFace is pure-Python + TensorFlow and supports `mediapipe` as a
  detector backend, so the detect→embed→match architecture is unchanged.
- **Face dataset for automated testing:** using only self-supplied images
  for now to avoid consent/licensing issues with public face datasets
  (e.g. LFW has its own usage terms). Revisit in Phase 1 if broader
  automated testing is needed.
