import { lazy } from 'react'

export const VoiceAssistantsLandingPageAsync = lazy(
    async () => await import('./VoiceAssistantsLandingPage')
)
