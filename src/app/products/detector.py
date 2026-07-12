from dataclasses import dataclass
from functools import lru_cache

import numpy as np
from ultralytics import YOLO


@dataclass
class DetectedObject:
    bbox: tuple[int, int, int, int]
    confidence: float


@lru_cache
def _model() -> YOLO:
    # Pretrained COCO weights, downloaded automatically on first use.
    return YOLO("yolov8n.pt")


def detect_products(
    image_bgr: np.ndarray, confidence_threshold: float = 0.25
) -> list[DetectedObject]:
    results = _model().predict(image_bgr, verbose=False, conf=confidence_threshold)
    detections = []
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            detections.append(
                DetectedObject(
                    bbox=(int(x1), int(y1), int(x2 - x1), int(y2 - y1)),
                    confidence=float(box.conf[0]),
                )
            )
    return detections
