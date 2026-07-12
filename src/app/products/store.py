import uuid
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path

import numpy as np

from app.db import get_connection
from app.products.embedder import EMBEDDING_DIM
from app.vector_store import VectorIndex
from app.vectors import to_blob


@dataclass
class CatalogProduct:
    id: str
    name: str
    sku: str | None


@dataclass
class ProductMatch:
    id: str
    name: str
    confidence: float


class ProductStore:
    def __init__(self, db_path: Path):
        self._conn = get_connection(db_path)
        self._index = VectorIndex(self._conn, table="products", dim=EMBEDDING_DIM)

    def add(
        self,
        name: str,
        sku: str | None,
        embedding: np.ndarray,
        reference_image_path: str | None,
    ) -> CatalogProduct:
        product_id = str(uuid.uuid4())
        created_at = datetime.now(UTC).isoformat()
        self._conn.execute(
            """
            INSERT INTO products (id, name, sku, embedding, reference_image_path, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (product_id, name, sku, to_blob(embedding), reference_image_path, created_at),
        )
        self._conn.commit()
        self._index.add(product_id, embedding)
        return CatalogProduct(id=product_id, name=name, sku=sku)

    def match(self, embedding: np.ndarray, min_similarity: float) -> ProductMatch | None:
        result = self._index.search_top1(embedding)
        if result is None:
            return None
        product_id, similarity = result
        if similarity < min_similarity:
            return None
        row = self._conn.execute(
            "SELECT name FROM products WHERE id = ?", (product_id,)
        ).fetchone()
        if row is None:
            return None
        return ProductMatch(id=product_id, name=row["name"], confidence=similarity)
