import { useState } from 'react'
import { ApiError, recognizeProducts } from '../api'
import { DetectionOverlay } from './DetectionOverlay'
import type { DetectionBox } from './DetectionOverlay'
import { ImageDropzone } from './ImageDropzone'
import { StatusBanner } from './StatusBanner'

export function RecognizeProductsPanel() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [boxes, setBoxes] = useState<DetectionBox[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSelect = (picked: File) => {
    setFile(picked)
    setPreviewUrl(URL.createObjectURL(picked))
    setBoxes(null)
    setError(null)
  }

  const handleRecognize = async () => {
    if (!file) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await recognizeProducts(file)
      setBoxes(
        result.products.map((product) => ({
          bbox: product.bbox,
          label: product.name ?? 'Unknown',
          confidence: product.confidence,
        })),
      )
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to recognize products.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="panel">
      <h2>Recognize products</h2>
      <p className="panel-hint">Upload a photo to detect products and match them against the catalog.</p>
      <ImageDropzone file={file} previewUrl={previewUrl} onSelect={handleSelect} />
      <button type="button" disabled={!file || isLoading} onClick={handleRecognize}>
        {isLoading ? 'Recognizing…' : 'Recognize products'}
      </button>
      {error && <StatusBanner kind="error" message={error} />}
      {boxes && previewUrl && (
        <>
          <DetectionOverlay imageUrl={previewUrl} boxes={boxes} />
          {boxes.length === 0 ? (
            <p className="panel-hint">No products detected.</p>
          ) : (
            <p className="panel-hint">
              {boxes.length} product{boxes.length === 1 ? '' : 's'} detected.
            </p>
          )}
        </>
      )}
    </div>
  )
}
