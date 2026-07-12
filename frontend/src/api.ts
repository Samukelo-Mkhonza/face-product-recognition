import type {
  AddProductResponse,
  EnrollFaceResponse,
  IdentifyFacesResponse,
  RecognizeProductsResponse,
} from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function parseErrorDetail(response: Response): Promise<string> {
  try {
    const body = await response.json()
    if (typeof body?.detail === 'string') return body.detail
  } catch {
    // response wasn't JSON; fall through to status text
  }
  return response.statusText || `Request failed with status ${response.status}`
}

async function postForm<T>(path: string, form: FormData): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { method: 'POST', body: form })
  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorDetail(response))
  }
  return response.json() as Promise<T>
}

export function enrollFace(name: string, image: File): Promise<EnrollFaceResponse> {
  const form = new FormData()
  form.append('name', name)
  form.append('image', image)
  return postForm<EnrollFaceResponse>('/faces/enroll', form)
}

export function identifyFaces(image: File): Promise<IdentifyFacesResponse> {
  const form = new FormData()
  form.append('image', image)
  return postForm<IdentifyFacesResponse>('/faces/identify', form)
}

export function addProduct(
  name: string,
  sku: string | undefined,
  image: File,
): Promise<AddProductResponse> {
  const form = new FormData()
  form.append('name', name)
  if (sku) form.append('sku', sku)
  form.append('image', image)
  return postForm<AddProductResponse>('/products', form)
}

export function recognizeProducts(image: File): Promise<RecognizeProductsResponse> {
  const form = new FormData()
  form.append('image', image)
  return postForm<RecognizeProductsResponse>('/products/recognize', form)
}
