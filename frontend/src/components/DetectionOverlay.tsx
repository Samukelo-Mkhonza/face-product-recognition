import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import type { BBox } from '../types'

export interface DetectionBox {
  bbox: BBox
  label: string
  confidence: number | null
}

interface DetectionOverlayProps {
  imageUrl: string
  boxes: DetectionBox[]
}

export function DetectionOverlay({ imageUrl, boxes }: DetectionOverlayProps) {
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null)

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight })
  }

  return (
    <div className="detection-overlay">
      <img src={imageUrl} alt="Uploaded" onLoad={handleLoad} />
      {naturalSize &&
        boxes.map((box, index) => {
          const [x, y, w, h] = box.bbox
          const matched = box.label !== 'Unknown'
          return (
            <div
              key={index}
              className={`bbox${matched ? ' bbox-matched' : ' bbox-unmatched'}`}
              style={{
                left: `${(x / naturalSize.width) * 100}%`,
                top: `${(y / naturalSize.height) * 100}%`,
                width: `${(w / naturalSize.width) * 100}%`,
                height: `${(h / naturalSize.height) * 100}%`,
              }}
            >
              <span className="bbox-label">
                {box.label}
                {box.confidence != null ? ` (${(box.confidence * 100).toFixed(0)}%)` : ''}
              </span>
            </div>
          )
        })}
    </div>
  )
}
