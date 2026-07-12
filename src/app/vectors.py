import numpy as np


def normalize(vector: np.ndarray) -> np.ndarray:
    vector = vector.astype(np.float32)
    norm = np.linalg.norm(vector)
    if norm == 0:
        return vector
    return vector / norm


def to_blob(vector: np.ndarray) -> bytes:
    return vector.astype(np.float32).tobytes()


def from_blob(blob: bytes) -> np.ndarray:
    return np.frombuffer(blob, dtype=np.float32).copy()
