from dataclasses import dataclass

import numpy as np
from deepface import DeepFace


@dataclass
class DetectedFace:
    bbox: tuple[int, int, int, int]
    confidence: float


def detect_faces(image_bgr: np.ndarray) -> list[DetectedFace]:
    """Detect faces via DeepFace's `mediapipe` backend.

    `enforce_detection=False` keeps DeepFace from raising when no face is
    found, but in that case it falls back to returning the whole image as a
    single zero-confidence "face" — filtered out below so a blank/no-face
    image correctly yields an empty list.
    """
    try:
        results = DeepFace.extract_faces(
            img_path=image_bgr,
            detector_backend="mediapipe",
            enforce_detection=False,
            align=False,
        )
    except ValueError:
        return []

    faces = []
    for result in results:
        confidence = float(result.get("confidence", 0))
        if confidence <= 0:
            continue
        area = result["facial_area"]
        faces.append(
            DetectedFace(
                bbox=(area["x"], area["y"], area["w"], area["h"]),
                confidence=confidence,
            )
        )
    return faces
