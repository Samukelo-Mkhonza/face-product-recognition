import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ApiError } from '../api'
import type { DetectionBox } from './DetectionOverlay'
import { DetectionOverlay } from './DetectionOverlay'
import { ImageDropzone } from './ImageDropzone'
import { ImageIcon, Spinner } from './Icons'
import { ResultsList } from './ResultsList'
import { StatusBanner } from './StatusBanner'

interface RecognitionWorkspaceProps {
  noun: string
  nounPlural: string
  actionLabel: string
  loadingLabel: string
  emptyHint: string
  noDetectionsHint: string
  fallbackError: string
  emptyIcon: ReactNode
  analyze: (file: File) => Promise<DetectionBox[]>
}

export function RecognitionWorkspace({
  noun,
  nounPlural,
  actionLabel,
  loadingLabel,
  emptyHint,
  noDetectionsHint,
  fallbackError,
  emptyIcon,
  analyze,
}: RecognitionWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [boxes, setBoxes] = useState<DetectionBox[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const previewUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  const setPreview = (url: string | null) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    previewUrlRef.current = url
    setPreviewUrl(url)
  }

  const handleSelect = (picked: File) => {
    setFile(picked)
    setPreview(URL.createObjectURL(picked))
    setBoxes(null)
    setError(null)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setBoxes(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setIsLoading(true)
    setError(null)
    setBoxes(null)
    try {
      setBoxes(await analyze(file))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : fallbackError)
    } finally {
      setIsLoading(false)
    }
  }

  const matchedCount = boxes?.filter((box) => box.matched).length ?? 0

  return (
    <div className="workspace">
      <section className="card" aria-label="Upload">
        <h2 className="card-title">Upload an image</h2>
        <ImageDropzone
          file={file}
          previewUrl={previewUrl}
          onSelect={handleSelect}
          onClear={handleClear}
          disabled={isLoading}
        />
        <button
          type="button"
          className="btn btn-primary"
          disabled={!file || isLoading}
          onClick={handleAnalyze}
        >
          {isLoading && <Spinner />}
          {isLoading ? loadingLabel : actionLabel}
        </button>
        {error && <StatusBanner kind="error" message={error} onDismiss={() => setError(null)} />}
      </section>

      <section className="card" aria-label="Results" aria-live="polite" aria-busy={isLoading}>
        <h2 className="card-title">Results</h2>

        {isLoading && (
          <div className="results-skeleton" aria-hidden="true">
            <div className="skeleton skeleton-image" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-line-short" />
          </div>
        )}

        {!isLoading && boxes === null && (
          <div className="empty-state">
            <span className="empty-icon">{emptyIcon}</span>
            <p className="empty-title">No results yet</p>
            <p className="empty-body">{emptyHint}</p>
          </div>
        )}

        {!isLoading && boxes !== null && boxes.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">
              <ImageIcon width={24} height={24} />
            </span>
            <p className="empty-title">No {nounPlural} detected</p>
            <p className="empty-body">{noDetectionsHint}</p>
          </div>
        )}

        {!isLoading && boxes !== null && boxes.length > 0 && previewUrl && (
          <>
            <p className="results-summary">
              Detected <strong>{boxes.length}</strong> {boxes.length === 1 ? noun : nounPlural}
              {' — '}
              {matchedCount === 0
                ? 'no matches found.'
                : `${matchedCount} ${matchedCount === 1 ? 'match' : 'matches'} found.`}
            </p>
            <DetectionOverlay imageUrl={previewUrl} boxes={boxes} />
            <ResultsList imageUrl={previewUrl} boxes={boxes} />
          </>
        )}
      </section>
    </div>
  )
}
