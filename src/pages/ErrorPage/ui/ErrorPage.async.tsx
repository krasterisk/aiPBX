import { lazy } from 'react'

export const ErrorPageAsync = lazy(async () => await import('./ErrorPage'))
