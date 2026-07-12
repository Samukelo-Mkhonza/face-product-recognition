from dataclasses import dataclass
from pathlib import Path

from app.imaging import crop, decode_image
from app.products.detector import detect_products
from app.products.embedder import embed_product
from app.products.store import CatalogProduct, ProductMatch, ProductStore


@dataclass
class RecognizedProduct:
    bbox: tuple[int, int, int, int]
    match: ProductMatch | None


class ProductService:
    def __init__(self, store: ProductStore, match_threshold: float, reference_images_dir: Path):
        self._store = store
        self._match_threshold = match_threshold
        self._reference_images_dir = reference_images_dir

    def add_product(self, name: str, sku: str | None, image_bytes: bytes) -> CatalogProduct:
        image = decode_image(image_bytes)
        embedding = embed_product(image)
        product = self._store.add(
            name=name, sku=sku, embedding=embedding, reference_image_path=None
        )
        reference_path = self._reference_images_dir / f"{product.id}.jpg"
        reference_path.write_bytes(image_bytes)
        return product

    def recognize(self, image_bytes: bytes) -> list[RecognizedProduct]:
        image = decode_image(image_bytes)
        detections = detect_products(image)
        results = []
        for detection in detections:
            embedding = embed_product(crop(image, detection.bbox))
            match = self._store.match(embedding, min_similarity=self._match_threshold)
            results.append(RecognizedProduct(bbox=detection.bbox, match=match))
        return results
