import { canSubmitBalanceAlert } from './balanceAlertForm'

const base = {
    limitAmountRaw: '100',
    emails: ['a@b.com'],
    ownerUserId: '10',
    showInvoiceOption: false,
    sendInvoice: false,
    selectedOrgId: null,
    amountMode: 'average_monthly' as const,
    invoiceAmountRubRaw: '',
}

describe('canSubmitBalanceAlert', () => {
    it('requires positive limit and emails', () => {
        expect(canSubmitBalanceAlert(base)).toBe(true)
        expect(canSubmitBalanceAlert({ ...base, limitAmountRaw: '0' })).toBe(false)
        expect(canSubmitBalanceAlert({ ...base, emails: [] })).toBe(false)
        expect(canSubmitBalanceAlert({ ...base, ownerUserId: '' })).toBe(false)
    })

    it('accepts comma decimal separator in limit', () => {
        expect(canSubmitBalanceAlert({ ...base, limitAmountRaw: '50,5' })).toBe(true)
    })

    it('requires org and amount when invoice option is enabled', () => {
        const withInvoice = {
            ...base,
            showInvoiceOption: true,
            sendInvoice: true,
        }
        expect(canSubmitBalanceAlert(withInvoice)).toBe(false)
        expect(canSubmitBalanceAlert({
            ...withInvoice,
            selectedOrgId: '5',
            amountMode: 'average_monthly',
        })).toBe(true)
        expect(canSubmitBalanceAlert({
            ...withInvoice,
            selectedOrgId: '5',
            amountMode: 'fixed',
            invoiceAmountRubRaw: '1000',
        })).toBe(true)
        expect(canSubmitBalanceAlert({
            ...withInvoice,
            selectedOrgId: '5',
            amountMode: 'fixed',
            invoiceAmountRubRaw: '0',
        })).toBe(false)
    })

    it('does not require invoice fields when sendInvoice is off', () => {
        expect(canSubmitBalanceAlert({
            ...base,
            showInvoiceOption: true,
            sendInvoice: false,
        })).toBe(true)
    })
})
