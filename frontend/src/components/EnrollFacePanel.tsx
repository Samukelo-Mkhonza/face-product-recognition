import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, enrollFace } from '../api'
import { ImageDropzone } from './ImageDropzone'
import { Spinner } from './Icons'
import { StatusBanner } from './StatusBanner'

export function EnrollFacePanel() {
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
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
    setError(null)
    setSuccess(null)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!file || !name.trim()) return
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const enrolled = await enrollFace(name.trim(), file)
      setSuccess(`${enrolled.name} was enrolled successfully and can now be identified in photos.`)
      setName('')
      setFile(null)
      setPreview(null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong while enrolling. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="workspace workspace-form">
      <section className="card" aria-label="Enroll a person">
        <h2 className="card-title">Person details</h2>
        <form onSubmit={handleSubmit} className="panel-form">
          <label className="field">
            <span className="field-label">Full name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Jane Doe"
              autoComplete="off"
              required
              disabled={isLoading}
            />
          </label>
          <div className="field">
            <span className="field-label">Photo</span>
            <ImageDropzone
              file={file}
              previewUrl={previewUrl}
              onSelect={handleSelect}
              onClear={handleClear}
              disabled={isLoading}
              label="Drag & drop a photo of this person"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={!file || !name.trim() || isLoading}>
            {isLoading && <Spinner />}
            {isLoading ? 'Enrolling…' : 'Enroll person'}
          </button>
        </form>
        {error && <StatusBanner kind="error" message={error} onDismiss={() => setError(null)} />}
        {success && <StatusBanner kind="success" message={success} onDismiss={() => setSuccess(null)} />}
      </section>

      <aside className="card card-tips" aria-label="Tips for a good enrollment photo">
        <h2 className="card-title">For best results</h2>
        <ul className="tips-list">
          <li>Use a clear, front-facing photo with exactly one face in the frame.</li>
          <li>Good, even lighting helps — avoid strong shadows or backlight.</li>
          <li>Avoid sunglasses, masks, or anything covering the face.</li>
          <li>Higher-resolution photos produce more reliable matches.</li>
        </ul>
      </aside>
    </div>
  )
}
