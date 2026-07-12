from pathlib import Path

import cv2
import numpy as np
import pytest

from app.errors import NoFaceDetectedError
from app.faces.service import FaceService
from app.faces.store import FaceStore

FIXTURES_DIR = Path(__file__).parent / "fixtures" / "faces"


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
def face_service(tmp_path) -> FaceService:
    store = FaceStore(tmp_path / "test.db")
    return FaceService(store, match_threshold=0.35)


def test_identify_no_face_returns_empty(face_service: FaceService):
    assert face_service.identify(_blank_image_bytes()) == []


def test_enroll_no_face_raises(face_service: FaceService):
    with pytest.raises(NoFaceDetectedError):
        face_service.enroll(name="Nobody", image_bytes=_blank_image_bytes())


@pytest.mark.skipif(
    not _has_fixtures("known_1.jpg", "known_2.jpg", "unknown.jpg"),
    reason="requires self-supplied fixtures; see tests/fixtures/faces/README.md",
)
def test_identify_known_and_unknown_face(face_service: FaceService):
    face_service.enroll(name="Known Person", image_bytes=_fixture_bytes("known_1.jpg"))

    known_results = face_service.identify(_fixture_bytes("known_2.jpg"))
    assert len(known_results) == 1
    assert known_results[0].match is not None
    assert known_results[0].match.name == "Known Person"

    unknown_results = face_service.identify(_fixture_bytes("unknown.jpg"))
    assert len(unknown_results) == 1
    assert unknown_results[0].match is None


@pytest.mark.skipif(
    not _has_fixtures("multiple.jpg"),
    reason="requires a self-supplied multi-face fixture; see tests/fixtures/faces/README.md",
)
def test_identify_multiple_faces(face_service: FaceService):
    results = face_service.identify(_fixture_bytes("multiple.jpg"))
    assert len(results) >= 2
