import cv2
import numpy as np
import pytest
from fastapi.testclient import TestClient

from app.deps import get_face_service, get_product_service
from app.faces.service import FaceService
from app.faces.store import FaceStore
from app.main import app
from app.products.service import ProductService
from app.products.store import ProductStore


def _blank_image_bytes() -> bytes:
    image = np.zeros((200, 200, 3), dtype=np.uint8)
    success, encoded = cv2.imencode(".jpg", image)
    assert success
    return encoded.tobytes()


@pytest.fixture
def client(tmp_path) -> TestClient:
    face_service = FaceService(FaceStore(tmp_path / "faces.db"), match_threshold=0.35)
    product_service = ProductService(
        ProductStore(tmp_path / "products.db"), match_threshold=0.75, reference_images_dir=tmp_path
    )

    app.dependency_overrides[get_face_service] = lambda: face_service
    app.dependency_overrides[get_product_service] = lambda: product_service
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_health(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_enroll_face_requires_a_face(client: TestClient):
    response = client.post(
        "/faces/enroll",
        data={"name": "Nobody"},
        files={"image": ("blank.jpg", _blank_image_bytes(), "image/jpeg")},
    )
    assert response.status_code == 400


def test_identify_faces_empty_image(client: TestClient):
    response = client.post(
        "/faces/identify",
        files={"image": ("blank.jpg", _blank_image_bytes(), "image/jpeg")},
    )
    assert response.status_code == 200
    assert response.json() == {"faces": []}


def test_add_product(client: TestClient):
    response = client.post(
        "/products",
        data={"name": "Test Product", "sku": "SKU-1"},
        files={"image": ("blank.jpg", _blank_image_bytes(), "image/jpeg")},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["name"] == "Test Product"
    assert body["sku"] == "SKU-1"


def test_recognize_products_empty_image(client: TestClient):
    response = client.post(
        "/products/recognize",
        files={"image": ("blank.jpg", _blank_image_bytes(), "image/jpeg")},
    )
    assert response.status_code == 200
    assert response.json() == {"products": []}
