export type InvoiceAmountMode = 'fixed' | 'average_monthly'

export interface BalanceThresholdAlert {
    id: number
    ownerUserId: number
    limitAmount: number
    emails: string[]
    notifyUserIds: number[]
    sendInvoice: boolean
    organizationId: number | null
    invoiceAmountMode: InvoiceAmountMode
    invoiceAmountRub: number | null
    sendViaEdo: boolean
    lastTriggeredAt?: string | null
}

export interface CreateBalanceAlertBody {
    ownerUserId?: string
    limitAmount: number
    emails: string[]
    notifyUserIds?: number[]
    sendInvoice?: boolean
    organizationId?: number
    invoiceAmountMode?: InvoiceAmountMode
    invoiceAmountRub?: number
    sendViaEdo?: boolean
}

export type UpdateBalanceAlertBody = Partial<Omit<CreateBalanceAlertBody, 'ownerUserId'>>
