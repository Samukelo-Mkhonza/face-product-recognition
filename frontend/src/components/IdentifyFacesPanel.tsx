import { useState } from 'react'
import { ApiError, identifyFaces } from '../api'
import { DetectionOverlay } from './DetectionOverlay'
import type { DetectionBox } from './DetectionOverlay'
import { ImageDropzone } from './ImageDropzone'
import { StatusBanner } from './StatusBanner'

export function IdentifyFacesPanel() {
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

  const handleIdentify = async () => {
    if (!file) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await identifyFaces(file)
      setBoxes(
        result.faces.map((face) => ({
          bbox: face.bbox,
          label: face.name ?? 'Unknown',
          confidence: face.confidence,
        })),
      )
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to identify faces.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="panel">
      <h2>Identify faces</h2>
      <p className="panel-hint">Upload a photo to detect faces and match them against enrolled people.</p>
      <ImageDropzone file={file} previewUrl={previewUrl} onSelect={handleSelect} />
      <button type="button" disabled={!file || isLoading} onClick={handleIdentify}>
        {isLoading ? 'Identifying…' : 'Identify faces'}
      </button>
      {error && <StatusBanner kind="error" message={error} />}
      {boxes && previewUrl && (
        <>
          <DetectionOverlay imageUrl={previewUrl} boxes={boxes} />
          {boxes.length === 0 ? (
            <p className="panel-hint">No faces detected.</p>
          ) : (
            <p className="panel-hint">
              {boxes.length} face{boxes.length === 1 ? '' : 's'} detected.
            </p>
          )}
        </>
      )}
    </div>
  )
}
