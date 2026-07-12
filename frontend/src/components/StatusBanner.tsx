interface StatusBannerProps {
  kind: 'error' | 'success'
  message: string
}

export function StatusBanner({ kind, message }: StatusBannerProps) {
  return <div className={`banner banner-${kind}`}>{message}</div>
}
