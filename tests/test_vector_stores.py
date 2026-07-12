"""Store-level matching/persistence tests using synthetic embeddings.

These don't touch MediaPipe/DeepFace/YOLO/CLIP at all, so they're fast and
always run — unlike the fixture-gated tests in test_faces.py/test_products.py
which exercise the real detect->embed->match pipeline end to end.
"""

import numpy as np

from app.faces.store import FaceStore
from app.products.store import ProductStore


def _unit_vector(dim: int, seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    vector = rng.normal(size=dim).astype(np.float32)
    return vector / np.linalg.norm(vector)


def test_face_store_matches_enrolled_embedding(tmp_path):
    store = FaceStore(tmp_path / "faces.db")
    embedding = _unit_vector(512, seed=1)
    store.enroll(name="Alice", embedding=embedding)

    match = store.match(embedding, max_distance=0.01)
    assert match is not None
    assert match.name == "Alice"


def test_face_store_no_match_for_dissimilar_embedding(tmp_path):
    store = FaceStore(tmp_path / "faces.db")
    store.enroll(name="Alice", embedding=_unit_vector(512, seed=1))

    match = store.match(_unit_vector(512, seed=2), max_distance=0.01)
    assert match is None


def test_face_store_no_match_when_empty(tmp_path):
    store = FaceStore(tmp_path / "faces.db")
    assert store.match(_unit_vector(512, seed=3), max_distance=1.0) is None


def test_face_store_survives_reload_from_sqlite(tmp_path):
    db_path = tmp_path / "faces.db"
    embedding = _unit_vector(512, seed=4)
    FaceStore(db_path).enroll(name="Bob", embedding=embedding)

    reopened = FaceStore(db_path)
    match = reopened.match(embedding, max_distance=0.01)
    assert match is not None
    assert match.name == "Bob"


def test_product_store_matches_added_embedding(tmp_path):
    store = ProductStore(tmp_path / "products.db")
    embedding = _unit_vector(512, seed=10)
    store.add(name="Mug", sku="MUG-1", embedding=embedding, reference_image_path=None)

    match = store.match(embedding, min_similarity=0.99)
    assert match is not None
    assert match.name == "Mug"


def test_product_store_no_match_below_threshold(tmp_path):
    store = ProductStore(tmp_path / "products.db")
    store.add(
        name="Mug", sku=None, embedding=_unit_vector(512, seed=10), reference_image_path=None
    )

    match = store.match(_unit_vector(512, seed=20), min_similarity=0.99)
    assert match is None
