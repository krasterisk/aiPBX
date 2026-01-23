import { lazy } from 'react'

export const BillingPageAsync = lazy(async () => await import('./BillingPage'))
