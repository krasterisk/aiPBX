import * as Sentry from '@sentry/react'

export function initSentry (): void {
  const dsn = typeof __SENTRY_DSN__ !== 'undefined' ? __SENTRY_DSN__ : ''

  if (!dsn) {
    return
  }

  Sentry.init({
    dsn,
    environment: typeof __SENTRY_ENVIRONMENT__ !== 'undefined' ? __SENTRY_ENVIRONMENT__ : 'production',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0
  })
}

export { Sentry }
