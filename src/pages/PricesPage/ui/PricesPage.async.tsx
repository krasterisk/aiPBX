import { lazy } from 'react'

export const PricesPageAsync = lazy(async () => await import('./PricesPage')
    .then(module => ({ default: module.PricesPage })))
