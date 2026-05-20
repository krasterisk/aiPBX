export interface Payment {
    id: string
    amount: number
    currency: string
    status: 'succeeded' | 'pending' | 'failed'
    createdAt: string
    paymentMethod?: string
    description?: string
    receiptUrl?: string
    /** RUB per 1 USD at payment time (same as billing `fxRateUsdToCurrency`) */
    fxRateUsdToCurrency?: number | null
    fxRateRubUsd?: number | null
    /** Amount paid in RUB when applicable */
    amountRub?: number | null
}

export interface PaymentListResponse {
    rows: Payment[]
    count: number
}
