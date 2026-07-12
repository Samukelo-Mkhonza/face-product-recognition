import { AlertCircleIcon, CheckCircleIcon, XIcon } from './Icons'

interface StatusBannerProps {
  kind: 'error' | 'success'
  message: string
  onDismiss?: () => void
}

export function StatusBanner({ kind, message, onDismiss }: StatusBannerProps) {
  return (
    <div className={`banner banner-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {kind === 'error' ? (
        <AlertCircleIcon className="banner-icon" />
      ) : (
        <CheckCircleIcon className="banner-icon" />
      )}
      <span className="banner-message">{message}</span>
      {onDismiss && (
        <button type="button" className="banner-dismiss" onClick={onDismiss} aria-label="Dismiss">
          <XIcon width={16} height={16} />
        </button>
      )}
    </div>
  )
}
