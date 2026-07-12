import { useCallback, useRef, useState } from 'react'
import type { DragEvent } from 'react'

interface ImageDropzoneProps {
  file: File | null
  previewUrl: string | null
  onSelect: (file: File) => void
  label?: string
}

export function ImageDropzone({ file, previewUrl, onSelect, label }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const picked = files?.[0]
      if (picked && picked.type.startsWith('image/')) {
        onSelect(picked)
      }
    },
    [onSelect],
  )

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    handleFiles(event.dataTransfer.files)
  }

  return (
    <div
      className={`dropzone${isDragging ? ' dropzone-active' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click()
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => handleFiles(event.target.files)}
      />
      {previewUrl ? (
        <img src={previewUrl} alt={file?.name ?? 'preview'} className="dropzone-preview" />
      ) : (
        <div className="dropzone-placeholder">
          <span>{label ?? 'Drop an image here, or click to choose one'}</span>
        </div>
      )}
    </div>
  )
}
