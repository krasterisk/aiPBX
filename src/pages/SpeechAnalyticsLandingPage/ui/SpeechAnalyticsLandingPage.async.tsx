import { lazy } from 'react'

export const SpeechAnalyticsLandingPageAsync = lazy(
    async () => await import('./SpeechAnalyticsLandingPage')
)
