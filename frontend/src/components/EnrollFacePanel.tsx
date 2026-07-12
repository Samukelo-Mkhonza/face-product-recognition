import { useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, enrollFace } from '../api'
import { ImageDropzone } from './ImageDropzone'
import { StatusBanner } from './StatusBanner'

export function EnrollFacePanel() {
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSelect = (picked: File) => {
    setFile(picked)
    setPreviewUrl(URL.createObjectURL(picked))
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!file || !name.trim()) return
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const enrolled = await enrollFace(name.trim(), file)
      setSuccess(`Enrolled "${enrolled.name}".`)
      setName('')
      setFile(null)
      setPreviewUrl(null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to enroll face.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="panel">
      <h2>Enroll a face</h2>
      <p className="panel-hint">Add a known person so they can be identified later. The photo must contain exactly one face.</p>
      <form onSubmit={handleSubmit} className="panel-form">
        <label className="field">
          <span>Name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Jane Doe"
            required
          />
        </label>
        <ImageDropzone file={file} previewUrl={previewUrl} onSelect={handleSelect} />
        <button type="submit" disabled={!file || !name.trim() || isLoading}>
          {isLoading ? 'Enrolling…' : 'Enroll face'}
        </button>
      </form>
      {error && <StatusBanner kind="error" message={error} />}
      {success && <StatusBanner kind="success" message={success} />}
    </div>
  )
}
