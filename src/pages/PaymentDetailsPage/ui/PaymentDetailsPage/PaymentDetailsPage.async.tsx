import { lazy } from 'react'

export const PaymentDetailsPageAsync = lazy(
    async () => await import('./PaymentDetailsPage'),
)
