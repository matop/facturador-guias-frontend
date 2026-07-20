import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div role="alert" className="p-8 text-center">
          <p className="font-semibold text-destructive">Error inesperado</p>
          <p className="text-sm text-muted-foreground mt-1">{this.state.error?.message}</p>
        </div>
      )
    }
    return this.props.children
  }
}
