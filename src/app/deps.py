from functools import lru_cache

from app.config import get_settings
from app.faces.service import FaceService
from app.faces.store import FaceStore
from app.products.service import ProductService
from app.products.store import ProductStore


@lru_cache
def get_face_store() -> FaceStore:
    return FaceStore(get_settings().db_path)


@lru_cache
def get_face_service() -> FaceService:
    settings = get_settings()
    return FaceService(get_face_store(), match_threshold=settings.face_match_threshold)


@lru_cache
def get_product_store() -> ProductStore:
    return ProductStore(get_settings().db_path)


@lru_cache
def get_product_service() -> ProductService:
    settings = get_settings()
    return ProductService(
        get_product_store(),
        match_threshold=settings.product_match_threshold,
        reference_images_dir=settings.reference_images_dir,
    )
