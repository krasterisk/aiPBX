import { lazy } from 'react'

export const PaymentPageAsync = lazy(async () => await import('./PaymentPage'))
