from pydantic import BaseModel


class EnrollFaceResponse(BaseModel):
    id: str
    name: str
    enrolled_at: str


class FaceIdentification(BaseModel):
    bbox: list[int]
    name: str | None
    confidence: float | None


class IdentifyFacesResponse(BaseModel):
    faces: list[FaceIdentification]


class AddProductResponse(BaseModel):
    id: str
    name: str
    sku: str | None


class ProductRecognition(BaseModel):
    bbox: list[int]
    product_id: str | None
    name: str | None
    confidence: float | None


class RecognizeProductsResponse(BaseModel):
    products: list[ProductRecognition]
