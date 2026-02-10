import { lazy } from 'react'

export const ModelsPageAsync = lazy(async () => await import('./ModelsPage')
    .then(module => ({ default: module.ModelsPage })))
