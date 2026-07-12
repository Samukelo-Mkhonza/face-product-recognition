# Architecture

## Overview

Two parallel recognition pipelines (face, product) share a common pattern:
**detect → embed → match against a stored catalog of embeddings.** They're
exposed through one FastAPI service and one React (Vite + TypeScript) UI.

```
                    ┌──────────────────────┐
                    │   React (Vite) UI     │
                    └──────────┬───────────┘
                               │ HTTP (CORS in dev; same-origin in prod —
                               │ FastAPI serves the built static assets)
                    ┌──────────▼───────────┐
                    │      FastAPI App      │
                    │  /faces/*  /products/* │
                    └──┬─────────────────┬──┘
             ┌─────────▼──────┐   ┌──────▼──────────┐
             │  Face pipeline  │   │ Product pipeline │
             │ MediaPipe +     │   │ YOLOv8n +        │
             │ face_recognition│   │ CLIP ViT-B/32    │
             └─────────┬──────┘   └──────┬──────────┘
                       │                  │
                ┌──────▼──────────────────▼──────┐
                │   FAISS index (embeddings)      │
                │   SQLite (metadata: names,      │
                │   product info, thresholds)     │
                └─────────────────────────────────┘
```

## Face pipeline

1. **Detect** — MediaPipe Face Detector finds face bounding boxes in the
   input frame (via DeepFace's `mediapipe` detector backend).
2. **Embed** — each face crop is aligned and passed through DeepFace's
   Facenet512 model to get a 512-d embedding. (Originally planned as
   `face_recognition`/dlib; swapped because dlib needs a C++ toolchain to
   build on Windows and has no official wheels — see the "Open decisions"
   note in [PLAN.md](PLAN.md).)
3. **Match** — the embedding is compared (cosine distance) against all
   enrolled embeddings in FAISS; below-threshold nearest neighbor wins,
   otherwise the face is reported as "unknown."

Enrollment is the same pipeline minus the match step: store `{name,
embedding}`.

## Product pipeline

1. **Detect** — YOLOv8n (pretrained on COCO as a starting point; a
   product-specific fine-tune is a later, optional step) proposes bounding
   boxes for product-like objects.
2. **Embed** — each crop is passed through CLIP's image encoder
   (`ViT-B/32`) to get a general-purpose visual embedding. CLIP is used
   instead of a fixed classifier because it lets new products be added to
   the catalog by just embedding a reference photo — no retraining.
3. **Match** — cosine similarity search against catalog embeddings in
   FAISS; top-k candidates returned with confidence scores; below-threshold
   results are reported as "unknown product."

## Storage

- **SQLite** — structured metadata: enrolled names, product names/SKUs,
  matching thresholds, timestamps. Chosen for zero-ops local deployment;
  swappable for Postgres later if concurrent multi-user access is needed.
- **FAISS** — in-memory vector index, periodically persisted to disk
  (`data/faces.index`, `data/products.index`). Rebuilt from SQLite on
  startup if the index file is missing or stale.

## Why this shape

- **Detect/embed/match as a shared pattern** keeps the two pipelines
  structurally consistent even though the specific models differ, which
  keeps the API surface and testing approach uniform.
- **Embedding + nearest-neighbor instead of a fixed classifier** for both
  faces and products means new people/products can be added at runtime
  without retraining — the core requirement for a usable recognition app.
- **FastAPI + React split** keeps the programmatic API and the demo UI
  decoupled; the UI is just another API client, and either can be swapped
  or consumed independently (e.g. a future mobile client).

## Non-goals (for now)

- Real-time video streaming/tracking (frame-by-frame image recognition
  only, to start — see Phase 3+ in PLAN.md for revisiting this)
- Multi-tenant auth/permissions
- Mobile app (API-first; a mobile client could consume the same API later)
