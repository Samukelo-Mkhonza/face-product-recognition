import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, addProduct } from '../api'
import { ImageDropzone } from './ImageDropzone'
import { Spinner } from './Icons'
import { StatusBanner } from './StatusBanner'

export function AddProductPanel() {
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
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
      const product = await addProduct(name.trim(), sku.trim() || undefined, file)
      setSuccess(
        `${product.name}${product.sku ? ` (${product.sku})` : ''} was added to the catalog and can now be recognized in photos.`,
      )
      setName('')
      setSku('')
      setFile(null)
      setPreview(null)
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Something went wrong while adding the product. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="workspace workspace-form">
      <section className="card" aria-label="Add a product">
        <h2 className="card-title">Product details</h2>
        <form onSubmit={handleSubmit} className="panel-form">
          <label className="field">
            <span className="field-label">Product name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Blue Ceramic Mug"
              autoComplete="off"
              required
              disabled={isLoading}
            />
          </label>
          <label className="field">
            <span className="field-label">
              SKU <span className="field-optional">(optional)</span>
            </span>
            <input
              type="text"
              value={sku}
              onChange={(event) => setSku(event.target.value)}
              placeholder="e.g. MUG-001"
              autoComplete="off"
              disabled={isLoading}
            />
          </label>
          <div className="field">
            <span className="field-label">Reference photo</span>
            <ImageDropzone
              file={file}
              previewUrl={previewUrl}
              onSelect={handleSelect}
              onClear={handleClear}
              disabled={isLoading}
              label="Drag & drop a photo of this product"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={!file || !name.trim() || isLoading}>
            {isLoading && <Spinner />}
            {isLoading ? 'Adding product…' : 'Add product'}
          </button>
        </form>
        {error && <StatusBanner kind="error" message={error} onDismiss={() => setError(null)} />}
        {success && <StatusBanner kind="success" message={success} onDismiss={() => setSuccess(null)} />}
      </section>

      <aside className="card card-tips" aria-label="Tips for a good reference photo">
        <h2 className="card-title">For best results</h2>
        <ul className="tips-list">
          <li>Photograph the product on a plain, uncluttered background.</li>
          <li>Fill most of the frame with the product.</li>
          <li>Use even lighting and keep the product in sharp focus.</li>
          <li>Add an SKU if you use one — it appears alongside matches.</li>
        </ul>
      </aside>
    </div>
  )
}
