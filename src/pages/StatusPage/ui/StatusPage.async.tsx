import { lazy } from 'react'

export const StatusPageAsync = lazy(async () => await import('./StatusPage'))
