import { recognizeProducts } from '../api'
import { ScanObjectIcon } from './Icons'
import { RecognitionWorkspace } from './RecognitionWorkspace'

export function RecognizeProductsPanel() {
  return (
    <RecognitionWorkspace
      noun="product"
      nounPlural="products"
      actionLabel="Recognize products"
      loadingLabel="Recognizing products…"
      emptyHint="Upload a photo and run recognition to see detected products here, matched against your catalog."
      noDetectionsHint="Try a photo where products are clearly visible, well lit, and fill more of the frame."
      fallbackError="Something went wrong while recognizing products. Please try again."
      emptyIcon={<ScanObjectIcon width={24} height={24} />}
      analyze={async (file) => {
        const result = await recognizeProducts(file)
        return result.products.map((product) => ({
          bbox: product.bbox,
          label: product.name ?? 'Unknown',
          confidence: product.confidence,
          matched: product.name != null,
        }))
      }}
    />
  )
}
