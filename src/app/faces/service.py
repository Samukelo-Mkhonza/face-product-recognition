from dataclasses import dataclass

from app.errors import MultipleFacesDetectedError, NoFaceDetectedError
from app.faces.detector import detect_faces
from app.faces.embedder import embed_face
from app.faces.store import EnrolledFace, FaceMatch, FaceStore
from app.imaging import crop, decode_image


@dataclass
class IdentifiedFace:
    bbox: tuple[int, int, int, int]
    match: FaceMatch | None


class FaceService:
    def __init__(self, store: FaceStore, match_threshold: float):
        self._store = store
        self._match_threshold = match_threshold

    def enroll(self, name: str, image_bytes: bytes) -> EnrolledFace:
        image = decode_image(image_bytes)
        faces = detect_faces(image)
        if len(faces) == 0:
            raise NoFaceDetectedError("No face detected in image")
        if len(faces) > 1:
            raise MultipleFacesDetectedError("Multiple faces detected; expected exactly one")
        embedding = embed_face(crop(image, faces[0].bbox))
        return self._store.enroll(name=name, embedding=embedding)

    def identify(self, image_bytes: bytes) -> list[IdentifiedFace]:
        image = decode_image(image_bytes)
        faces = detect_faces(image)
        results = []
        for face in faces:
            embedding = embed_face(crop(image, face.bbox))
            match = self._store.match(embedding, max_distance=self._match_threshold)
            results.append(IdentifiedFace(bbox=face.bbox, match=match))
        return results
