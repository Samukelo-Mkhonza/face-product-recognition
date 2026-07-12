import { useCallback, useRef, useState } from 'react'
import type { DragEvent, KeyboardEvent } from 'react'
import { UploadIcon, XIcon } from './Icons'

const MAX_SIZE_BYTES = 10 * 1024 * 1024

interface ImageDropzoneProps {
  file: File | null
  previewUrl: string | null
  onSelect: (file: File) => void
  onClear?: () => void
  disabled?: boolean
  label?: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ImageDropzone({
  file,
  previewUrl,
  onSelect,
  onClear,
  disabled,
  label,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const picked = files?.[0]
      if (!picked) return
      if (!picked.type.startsWith('image/')) {
        setValidationError('That file is not an image. Please choose a JPEG, PNG, or WebP file.')
        return
      }
      if (picked.size > MAX_SIZE_BYTES) {
        setValidationError(
          `That image is ${formatBytes(picked.size)}. Please choose one under ${formatBytes(MAX_SIZE_BYTES)}.`,
        )
        return
      }
      setValidationError(null)
      onSelect(picked)
    },
    [onSelect],
  )

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    if (disabled) return
    handleFiles(event.dataTransfer.files)
  }

  const openPicker = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openPicker()
    }
  }

  return (
    <div className="dropzone-wrapper">
      <div
        className={`dropzone${isDragging ? ' dropzone-active' : ''}${disabled ? ' dropzone-disabled' : ''}`}
        onClick={openPicker}
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label={file ? `Selected image: ${file.name}. Activate to replace it.` : 'Upload an image'}
        onKeyDown={handleKeyDown}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            handleFiles(event.target.files)
            event.target.value = ''
          }}
        />
        {previewUrl ? (
          <img src={previewUrl} alt={file?.name ?? 'Selected image preview'} className="dropzone-preview" />
        ) : (
          <div className="dropzone-placeholder">
            <span className="dropzone-icon">
              <UploadIcon width={22} height={22} />
            </span>
            <span className="dropzone-title">{label ?? 'Drag & drop an image here'}</span>
            <span className="dropzone-sub">or click to browse — JPEG, PNG, or WebP up to 10 MB</span>
          </div>
        )}
      </div>

      {file && (
        <div className="dropzone-meta">
          <span className="dropzone-filename" title={file.name}>
            {file.name}
          </span>
          <span className="dropzone-filesize">{formatBytes(file.size)}</span>
          {onClear && (
            <button
              type="button"
              className="dropzone-clear"
              onClick={onClear}
              disabled={disabled}
              aria-label="Remove selected image"
            >
              <XIcon width={14} height={14} />
              Remove
            </button>
          )}
        </div>
      )}

      {validationError && (
        <p className="dropzone-error" role="alert">
          {validationError}
        </p>
      )}
    </div>
  )
}
