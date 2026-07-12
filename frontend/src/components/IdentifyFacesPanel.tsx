import { identifyFaces } from '../api'
import { ScanFaceIcon } from './Icons'
import { RecognitionWorkspace } from './RecognitionWorkspace'

export function IdentifyFacesPanel() {
  return (
    <RecognitionWorkspace
      noun="face"
      nounPlural="faces"
      actionLabel="Identify faces"
      loadingLabel="Identifying faces…"
      emptyHint="Upload a photo and run identification to see detected faces here, matched against enrolled people."
      noDetectionsHint="Try a sharper, well-lit photo where faces are clearly visible and not too small."
      fallbackError="Something went wrong while identifying faces. Please try again."
      emptyIcon={<ScanFaceIcon width={24} height={24} />}
      analyze={async (file) => {
        const result = await identifyFaces(file)
        return result.faces.map((face) => ({
          bbox: face.bbox,
          label: face.name ?? 'Unknown',
          confidence: face.confidence,
          matched: face.name != null,
        }))
      }}
    />
  )
}
