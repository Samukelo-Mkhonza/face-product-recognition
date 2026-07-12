import numpy as np
from deepface import DeepFace

from app.vectors import normalize

MODEL_NAME = "Facenet512"
EMBEDDING_DIM = 512


def embed_face(face_crop_bgr: np.ndarray) -> np.ndarray:
    result = DeepFace.represent(
        img_path=face_crop_bgr,
        model_name=MODEL_NAME,
        detector_backend="skip",
        enforce_detection=False,
    )
    embedding = np.array(result[0]["embedding"], dtype=np.float32)
    return normalize(embedding)
