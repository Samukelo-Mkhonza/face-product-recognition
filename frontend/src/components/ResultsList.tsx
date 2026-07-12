import { useEffect, useState } from 'react'
import type { DetectionBox } from './DetectionOverlay'

const THUMB_SIZE = 96

interface ResultsListProps {
  imageUrl: string
  boxes: DetectionBox[]
}

function cropThumbnails(img: HTMLImageElement, boxes: DetectionBox[]): (string | null)[] {
  return boxes.map(({ bbox: [x, y, w, h] }) => {
    if (w <= 0 || h <= 0) return null
    const canvas = document.createElement('canvas')
    canvas.width = THUMB_SIZE
    canvas.height = THUMB_SIZE
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const scale = Math.min(THUMB_SIZE / w, THUMB_SIZE / h)
    const dw = w * scale
    const dh = h * scale
    ctx.drawImage(img, x, y, w, h, (THUMB_SIZE - dw) / 2, (THUMB_SIZE - dh) / 2, dw, dh)
    return canvas.toDataURL()
  })
}

export function ResultsList({ imageUrl, boxes }: ResultsListProps) {
  const [thumbs, setThumbs] = useState<(string | null)[]>([])

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.onload = () => {
      if (!cancelled) setThumbs(cropThumbnails(img, boxes))
    }
    img.src = imageUrl
    return () => {
      cancelled = true
    }
  }, [imageUrl, boxes])

  return (
    <ul className="results-list">
      {boxes.map((box, index) => {
        const pct = box.confidence != null ? Math.round(box.confidence * 100) : null
        return (
          <li key={index} className="result-item">
            <span className={`result-index${box.matched ? '' : ' result-index-unmatched'}`}>
              {index + 1}
            </span>
            {thumbs[index] ? (
              <img src={thumbs[index]!} alt={`Detection ${index + 1}: ${box.label}`} className="result-thumb" />
            ) : (
              <span className="result-thumb result-thumb-empty" aria-hidden="true" />
            )}
            <div className="result-info">
              <span className={`result-name${box.matched ? '' : ' result-name-unmatched'}`}>
                {box.matched ? box.label : 'No match found'}
              </span>
              {pct != null ? (
                <div className="result-confidence">
                  <div
                    className="confidence-bar"
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pct}
                    aria-label={`Confidence ${pct}%`}
                  >
                    <div
                      className={`confidence-fill${box.matched ? '' : ' confidence-fill-unmatched'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="confidence-value">{pct}%</span>
                </div>
              ) : (
                <span className="result-detail">Detected, but not recognized</span>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
