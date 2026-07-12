from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.deps import get_product_service
from app.products.service import ProductService
from app.schemas import AddProductResponse, ProductRecognition, RecognizeProductsResponse

router = APIRouter(prefix="/products", tags=["products"])


@router.post("", response_model=AddProductResponse, status_code=201)
async def add_product(
    name: str = Form(...),
    sku: str | None = Form(None),
    image: UploadFile = File(...),
    service: ProductService = Depends(get_product_service),
) -> AddProductResponse:
    image_bytes = await image.read()
    product = service.add_product(name=name, sku=sku, image_bytes=image_bytes)
    return AddProductResponse(id=product.id, name=product.name, sku=product.sku)


@router.post("/recognize", response_model=RecognizeProductsResponse)
async def recognize_products(
    image: UploadFile = File(...),
    service: ProductService = Depends(get_product_service),
) -> RecognizeProductsResponse:
    image_bytes = await image.read()
    recognized = service.recognize(image_bytes)
    return RecognizeProductsResponse(
        products=[
            ProductRecognition(
                bbox=list(item.bbox),
                product_id=item.match.id if item.match else None,
                name=item.match.name if item.match else None,
                confidence=item.match.confidence if item.match else None,
            )
            for item in recognized
        ]
    )
