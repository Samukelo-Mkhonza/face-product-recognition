import uuid
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path

import numpy as np

from app.db import get_connection
from app.faces.embedder import EMBEDDING_DIM
from app.vector_store import VectorIndex
from app.vectors import to_blob


@dataclass
class EnrolledFace:
    id: str
    name: str
    enrolled_at: str


@dataclass
class FaceMatch:
    id: str
    name: str
    confidence: float


class FaceStore:
    def __init__(self, db_path: Path):
        self._conn = get_connection(db_path)
        self._index = VectorIndex(self._conn, table="faces", dim=EMBEDDING_DIM)

    def enroll(self, name: str, embedding: np.ndarray) -> EnrolledFace:
        face_id = str(uuid.uuid4())
        enrolled_at = datetime.now(UTC).isoformat()
        self._conn.execute(
            "INSERT INTO faces (id, name, embedding, enrolled_at) VALUES (?, ?, ?, ?)",
            (face_id, name, to_blob(embedding), enrolled_at),
        )
        self._conn.commit()
        self._index.add(face_id, embedding)
        return EnrolledFace(id=face_id, name=name, enrolled_at=enrolled_at)

    def match(self, embedding: np.ndarray, max_distance: float) -> FaceMatch | None:
        result = self._index.search_top1(embedding)
        if result is None:
            return None
        face_id, similarity = result
        if (1 - similarity) > max_distance:
            return None
        row = self._conn.execute("SELECT name FROM faces WHERE id = ?", (face_id,)).fetchone()
        if row is None:
            return None
        return FaceMatch(id=face_id, name=row["name"], confidence=similarity)
