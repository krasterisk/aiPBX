import { buildDistributionCallsSheet } from './distributionCallsExport'

const t = (key: string) => key

describe('buildDistributionCallsSheet', () => {
    it('exports every selected call with the unsuccessful outcome and its reason', () => {
        const sheet = buildDistributionCallsSheet([
            {
                id: '1',
                createdAt: '2026-09-28T05:10:03.097Z',
                assistantName: '221',
                callerId: '+73912025813',
                duration: 408,
                analytics: {
                    metrics: {
                        success: false,
                        summary: 'Запись не состоялась',
                        _assessments: {
                            success: {
                                rationale: 'Пациент не записался.',
                                quote: 'Я перезвоню',
                            },
                        },
                    },
                },
            },
            {
                id: '2',
                createdAt: '2026-09-29T05:10:03.097Z',
                operatorName: 'Виктория',
                clientPhone: '+70000000000',
                duration: 60,
                analytics: {
                    metrics: { success: true, summary: 'Записали' },
                },
            },
        ], t)

        expect(sheet.rows).toHaveLength(2)
        expect(sheet.rows[0]['Результат']).toBe('Неуспешно')
        expect(sheet.rows[0]['Итог обращения']).toBe('Пациент не записался. «Я перезвоню»')
        expect(sheet.rows[0]['Саммари']).toBe('Запись не состоялась')
        expect(sheet.rows[0]['Оператор']).toBe('221')
        expect(sheet.rows[1]['Результат']).toBe('Успех')
        expect(sheet.rows[1]['Клиент']).toBe('+70000000000')
        expect(sheet.rows[1]['Оператор']).toBe('Виктория')
    })
})
