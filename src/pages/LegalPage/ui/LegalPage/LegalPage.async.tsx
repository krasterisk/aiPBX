import { lazy } from 'react'

export const LegalPageAsync = lazy(async () => await import('./LegalPage'))
