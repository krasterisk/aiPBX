import { callCosts } from './callCosts'
import { formatDuration } from '@/shared/lib/formatDuration'
it('formats minutes and hours with two digits and preserves absent durations', () => {
 expect([0, 83, 3603, 3661].map(formatDuration)).toEqual(['00:00', '01:23', '01:00:03', '01:01:01']); expect(formatDuration()).toBe('—')
})
it('groups charged components by currency and excludes free administrative usage', () => {
 const report: any = { billingRecords: [{ type: 'analytic', currency: 'RUB', amountCurrency: 90, totalCost: 1, textCost: 0.8, sttCost: 0.2, fxRateUsdToCurrency: 90 }, { type: 'realtime', currency: 'RUB', amountCurrency: 180, totalCost: 2 }, { type: 'analytic_regen_free', currency: 'RUB', amountCurrency: 0, totalCost: 0, textCost: 9 }, { type: 'analytic', currency: 'USD', totalCost: 0.5, textCost: 0.5 }] }
 expect(callCosts(report)).toEqual([{ currency: 'RUB', total: 270, items: { transcription: 18, analytics: 72, realtime: 180 }, freeRuns: 1 }, { currency: 'USD', total: 0.5, items: { analytics: 0.5 }, freeRuns: 0 }])
})

it('keeps a legacy charged total when its only itemized record is a free admin run', () => { expect(callCosts({ cost: 1.5, billingRecords: [{ type: 'analytic_regen_free', totalCost: 0 }] } as any)).toEqual([{ currency: 'USD', total: 1.5, items: {}, freeRuns: 1 }]) })
