import { lazy } from 'react'

export const DocsPageAsync = lazy(async () => await import('./DocsPage'))
