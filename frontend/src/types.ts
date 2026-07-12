export type BBox = [number, number, number, number]

export interface EnrollFaceResponse {
  id: string
  name: string
  enrolled_at: string
}

export interface FaceIdentification {
  bbox: BBox
  name: string | null
  confidence: number | null
}

export interface IdentifyFacesResponse {
  faces: FaceIdentification[]
}

export interface AddProductResponse {
  id: string
  name: string
  sku: string | null
}

export interface ProductRecognition {
  bbox: BBox
  product_id: string | null
  name: string | null
  confidence: number | null
}

export interface RecognizeProductsResponse {
  products: ProductRecognition[]
}
