from functools import lru_cache

import numpy as np
import open_clip
import torch
from PIL import Image

from app.vectors import normalize

MODEL_NAME = "ViT-B-32"
PRETRAINED = "openai"
EMBEDDING_DIM = 512


@lru_cache
def _model_and_preprocess():
    model, _, preprocess = open_clip.create_model_and_transforms(MODEL_NAME, pretrained=PRETRAINED)
    model.eval()
    return model, preprocess


def embed_product(crop_bgr: np.ndarray) -> np.ndarray:
    model, preprocess = _model_and_preprocess()
    rgb = crop_bgr[:, :, ::-1]
    image = Image.fromarray(rgb)
    tensor = preprocess(image).unsqueeze(0)
    with torch.no_grad():
        features = model.encode_image(tensor)
    embedding = features.squeeze(0).cpu().numpy().astype(np.float32)
    return normalize(embedding)
