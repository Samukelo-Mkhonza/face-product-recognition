from pathlib import Path

import cv2
import numpy as np
import pytest

from app.products.service import ProductService
from app.products.store import ProductStore

FIXTURES_DIR = Path(__file__).parent / "fixtures" / "products"


def _blank_image_bytes() -> bytes:
    image = np.zeros((200, 200, 3), dtype=np.uint8)
    success, encoded = cv2.imencode(".jpg", image)
    assert success
    return encoded.tobytes()


def _fixture_bytes(filename: str) -> bytes:
    return (FIXTURES_DIR / filename).read_bytes()


def _has_fixtures(*filenames: str) -> bool:
    return all((FIXTURES_DIR / name).exists() for name in filenames)


@pytest.fixture
def product_service(tmp_path) -> ProductService:
    store = ProductStore(tmp_path / "test.db")
    return ProductService(store, match_threshold=0.75, reference_images_dir=tmp_path)


def test_recognize_empty_image_returns_no_products(product_service: ProductService):
    assert product_service.recognize(_blank_image_bytes()) == []


@pytest.mark.skipif(
    not _has_fixtures("product_1.jpg", "product_1_other_angle.jpg"),
    reason="requires self-supplied product photos; see tests/fixtures/products/README.md",
)
def test_recognize_known_product(product_service: ProductService):
    product_service.add_product(
        name="Test Mug", sku="MUG-1", image_bytes=_fixture_bytes("product_1.jpg")
    )
    results = product_service.recognize(_fixture_bytes("product_1_other_angle.jpg"))
    assert len(results) >= 1
    assert any(item.match and item.match.name == "Test Mug" for item in results)


@pytest.mark.skipif(
    not _has_fixtures("unknown_product.jpg"),
    reason="requires a self-supplied fixture; see tests/fixtures/products/README.md",
)
def test_recognize_unknown_product_reports_no_match(product_service: ProductService):
    results = product_service.recognize(_fixture_bytes("unknown_product.jpg"))
    for item in results:
        assert item.match is None
