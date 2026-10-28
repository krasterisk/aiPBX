import { formatCallCost } from './formatCallCost'
import type { Report } from '@/entities/Report'

jest.mock('@/entities/Report', () => jest.requireActual('@/entities/Report/lib/reportDisplayMoneyInput'))

it('uses charged currency with exactly two decimal places', () => {
    expect(formatCallCost({ cost: 0.12345, amountCurrency: 12.345, costCurrency: 'RUB' } as Report, 'ru-RU')).toBe(new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(12.345))
})

it('uses linked billing snapshots for legacy charges', () => {
    expect(formatCallCost({ billingRecords: [{ amountCurrency: 12.341, currency: 'EUR', totalCost: 0.15 }] } as Report, 'en-US')).toBe('€12.34')
})

it('distinguishes zero charges from missing costs', () => {
    expect(formatCallCost({ cost: 0 } as Report, 'en-US')).toBe('$0.00')
    expect(formatCallCost({} as Report, 'en-US')).toBe('—')
})
