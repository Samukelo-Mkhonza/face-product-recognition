# API Reference

> Planned contract for the Phase 4 FastAPI service. Not implemented yet —
> this doc is written first so the endpoints below are the target, not a
> description of existing code. Update this doc in the same PR that
> implements or changes an endpoint.

Base URL (local): `http://localhost:8000`

## Faces

### `POST /faces/enroll`

Register a known face.

**Request:** `multipart/form-data`
- `name` (string, required)
- `image` (file, required) — must contain exactly one face

**Response `201`**
```json
{ "id": "uuid", "name": "Jane Doe", "enrolled_at": "2026-07-12T00:00:00Z" }
```

**Errors:** `400` no face / multiple faces found.

### `POST /faces/identify`

Identify all faces in an image.

**Request:** `multipart/form-data`
- `image` (file, required)

**Response `200`**
```json
{
  "faces": [
    { "bbox": [x, y, w, h], "name": "Jane Doe", "confidence": 0.94 },
    { "bbox": [x, y, w, h], "name": null, "confidence": null }
  ]
}
```
`name: null` means no enrolled match above the similarity threshold.

## Products

### `POST /products`

Add a product to the catalog.

**Request:** `multipart/form-data`
- `name` (string, required)
- `sku` (string, optional)
- `image` (file, required) — reference photo

**Response `201`**
```json
{ "id": "uuid", "name": "Blue Ceramic Mug", "sku": "MUG-001" }
```

### `POST /products/recognize`

Detect and identify products in an image.

**Request:** `multipart/form-data`
- `image` (file, required)

**Response `200`**
```json
{
  "products": [
    { "bbox": [x, y, w, h], "product_id": "uuid", "name": "Blue Ceramic Mug", "confidence": 0.88 },
    { "bbox": [x, y, w, h], "product_id": null, "name": null, "confidence": null }
  ]
}
```

## Common

- All endpoints return `422` on malformed input (FastAPI/Pydantic default).
- Interactive OpenAPI docs served at `/docs` once implemented.
- No auth in the initial version (local/single-user use case) — flagged as a
  gap to revisit before any multi-user deployment.
