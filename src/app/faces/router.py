from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.deps import get_face_service
from app.errors import MultipleFacesDetectedError, NoFaceDetectedError
from app.faces.service import FaceService
from app.schemas import EnrollFaceResponse, FaceIdentification, IdentifyFacesResponse

router = APIRouter(prefix="/faces", tags=["faces"])


@router.post("/enroll", response_model=EnrollFaceResponse, status_code=201)
async def enroll_face(
    name: str = Form(...),
    image: UploadFile = File(...),
    service: FaceService = Depends(get_face_service),
) -> EnrollFaceResponse:
    image_bytes = await image.read()
    try:
        enrolled = service.enroll(name=name, image_bytes=image_bytes)
    except (NoFaceDetectedError, MultipleFacesDetectedError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return EnrollFaceResponse(id=enrolled.id, name=enrolled.name, enrolled_at=enrolled.enrolled_at)


@router.post("/identify", response_model=IdentifyFacesResponse)
async def identify_faces(
    image: UploadFile = File(...),
    service: FaceService = Depends(get_face_service),
) -> IdentifyFacesResponse:
    image_bytes = await image.read()
    identified = service.identify(image_bytes)
    return IdentifyFacesResponse(
        faces=[
            FaceIdentification(
                bbox=list(item.bbox),
                name=item.match.name if item.match else None,
                confidence=item.match.confidence if item.match else None,
            )
            for item in identified
        ]
    )
