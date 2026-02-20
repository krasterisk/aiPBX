import React, { Suspense, type ErrorInfo, type ReactNode } from 'react'
import { PageError } from '@/widgets/PageError'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor (props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  // eslint-disable-next-line n/handle-callback-err
  static getDerivedStateFromError (error: Error) {
    return { hasError: true }
  }

  componentDidCatch (error: Error, errorInfo: ErrorInfo) {
    console.log(error, errorInfo)

    // Auto-reload once on ChunkLoadError (stale deployment chunks)
    if (error.name === 'ChunkLoadError') {
      const reloadKey = 'chunk_error_reload'
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, '1')
        window.location.reload()
        return
      }
      // Already tried reloading — clear flag and show error page
      sessionStorage.removeItem(reloadKey)
    }
  }

  render () {
    const { hasError } = this.state
    const { children } = this.props

    if (hasError) {
      return (
        <Suspense fallback="">
          <PageError />
        </Suspense>
      )
    }
    return children
  }
}

export default ErrorBoundary
