import sqlite3

import faiss
import numpy as np

from app.vectors import normalize


class VectorIndex:
    """FAISS cosine-similarity index over the `embedding` column of a SQLite table.

    Rebuilt from SQLite whenever the in-memory index is missing or its size no
    longer matches the table's row count (i.e. it's stale) — this is the
    "rebuild from SQLite on startup" behavior described in ARCHITECTURE.md,
    generalized to also cover a first-use build.
    """

    def __init__(self, conn: sqlite3.Connection, table: str, dim: int):
        self._conn = conn
        self._table = table
        self._dim = dim
        self._index: faiss.IndexFlatIP | None = None
        self._row_ids: list[str] = []
        self._ensure_fresh()

    def _row_count(self) -> int:
        return self._conn.execute(f"SELECT COUNT(*) FROM {self._table}").fetchone()[0]  # noqa: S608

    def _ensure_fresh(self) -> None:
        if self._index is not None and self._index.ntotal == self._row_count():
            return
        rows = self._conn.execute(f"SELECT id, embedding FROM {self._table}").fetchall()  # noqa: S608
        index = faiss.IndexFlatIP(self._dim)
        row_ids: list[str] = []
        if rows:
            vectors = np.stack(
                [normalize(np.frombuffer(row["embedding"], dtype=np.float32)) for row in rows]
            )
            index.add(vectors)
            row_ids = [row["id"] for row in rows]
        self._index = index
        self._row_ids = row_ids

    def add(self, row_id: str, vector: np.ndarray) -> None:
        self._ensure_fresh()
        self._index.add(normalize(vector).reshape(1, -1))
        self._row_ids.append(row_id)

    def search_top1(self, vector: np.ndarray) -> tuple[str, float] | None:
        self._ensure_fresh()
        if self._index.ntotal == 0:
            return None
        similarities, indices = self._index.search(normalize(vector).reshape(1, -1), 1)
        idx = int(indices[0][0])
        if idx == -1:
            return None
        return self._row_ids[idx], float(similarities[0][0])
