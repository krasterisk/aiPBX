export type InvoiceAmountMode = 'fixed' | 'average_monthly'

export interface BalanceAlertSubmitParams {
    limitAmountRaw: string
    emails: string[]
    ownerUserId: string | null | undefined
    showInvoiceOption: boolean
    sendInvoice: boolean
    selectedOrgId: string | null | undefined
    amountMode: InvoiceAmountMode
    invoiceAmountRubRaw: string
}

export function parseLimitAmount(raw: string): number {
    return parseFloat(raw.replace(',', '.'))
}

export function canSubmitBalanceAlert(params: BalanceAlertSubmitParams): boolean {
    const parsedLimit = parseLimitAmount(params.limitAmountRaw)
    const parsedInvoiceAmount = parseLimitAmount(params.invoiceAmountRubRaw)

    return !Number.isNaN(parsedLimit) &&
        parsedLimit > 0 &&
        params.emails.length > 0 &&
        !!params.ownerUserId &&
        (!params.showInvoiceOption || !params.sendInvoice || (
            !!params.selectedOrgId &&
            (params.amountMode === 'average_monthly' ||
                (!Number.isNaN(parsedInvoiceAmount) && parsedInvoiceAmount > 0))
        ))
}
