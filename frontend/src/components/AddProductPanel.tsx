import { useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, addProduct } from '../api'
import { ImageDropzone } from './ImageDropzone'
import { StatusBanner } from './StatusBanner'

export function AddProductPanel() {
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
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
      const product = await addProduct(name.trim(), sku.trim() || undefined, file)
      setSuccess(`Added "${product.name}"${product.sku ? ` (${product.sku})` : ''} to the catalog.`)
      setName('')
      setSku('')
      setFile(null)
      setPreviewUrl(null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to add product.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="panel">
      <h2>Add a product</h2>
      <p className="panel-hint">Add a reference photo of a product to the catalog for future recognition.</p>
      <form onSubmit={handleSubmit} className="panel-form">
        <label className="field">
          <span>Name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Blue Ceramic Mug"
            required
          />
        </label>
        <label className="field">
          <span>SKU (optional)</span>
          <input
            type="text"
            value={sku}
            onChange={(event) => setSku(event.target.value)}
            placeholder="MUG-001"
          />
        </label>
        <ImageDropzone file={file} previewUrl={previewUrl} onSelect={handleSelect} />
        <button type="submit" disabled={!file || !name.trim() || isLoading}>
          {isLoading ? 'Adding…' : 'Add product'}
        </button>
      </form>
      {error && <StatusBanner kind="error" message={error} />}
      {success && <StatusBanner kind="success" message={success} />}
    </div>
  )
}
