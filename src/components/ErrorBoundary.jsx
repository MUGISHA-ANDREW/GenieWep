import { Component } from 'react'

import Button from '@/components/Button/Button'
import { EMAIL_LINK } from '@/utils/constants'

/**
 * Catches render errors so a single broken component cannot leave a prospective
 * client staring at a blank page.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Replace with a real reporter (Sentry, LogRocket) before launch.
    console.error('Unhandled UI error:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5 py-20">
        <div className="max-w-md text-center">
          <h1 className="mb-3 text-xl text-title">Something went wrong</h1>
          <p className="mb-6 text-sm text-body">
            Sorry, this page failed to load. Please refresh, or get in touch and we
            will help you directly.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => window.location.reload()}>Reload page</Button>
            <Button href={EMAIL_LINK} variant="outline">
              Email us
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
