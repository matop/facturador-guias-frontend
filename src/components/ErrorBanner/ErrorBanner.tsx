interface ErrorBannerProps {
  error: Error | null
}

export function ErrorBanner({ error }: ErrorBannerProps) {
  if (!error) return null
  return (
    <div
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      {error.message}
    </div>
  )
}
