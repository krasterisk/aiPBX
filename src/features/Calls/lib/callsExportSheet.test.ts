import { buildCallsExportSheet } from './callsExportSheet'
import type { Report } from '@/entities/Report'
import type { TFunction } from 'i18next'

const t = ((key: string) => key) as TFunction

describe('buildCallsExportSheet', () => {
    it('includes operator metrics, summary and custom columns', () => {
        const reports: Report[] = [{
            id: '1',
            channelId: '99',
            callerId: '+7900',
            userId: '1',
            createdAt: '2026-06-19T10:00:00Z',
            assistantName: 'Operator 218',
            duration: 49,
            tokens: 3442,
            cost: 0.01,
            transcription: 'Клиент спросил о возврате',
            transcriptionQuality: 'ok',
            analytics: {
                channelId: '99',
                csat: 3,
                sentiment: 'Neutral',
                summary: 'Краткое резюме',
                metrics: {
                    greeting_quality: 80,
                    script_compliance: 70,
                    success: true,
                    customer_sentiment: 'Neutral',
                    csat: 3,
                    summary: 'Развёрнутое саммари',
                    custom_metrics: { refund_requested: true },
                    _custom_meta: { refund_requested: { name: 'Запрос возврата', type: 'boolean' } },
                    _assessments: {
                        greeting_quality: { rationale: 'Вежливое приветствие', quote: 'Здравствуйте' },
                    },
                    _topics: { keywords: ['возврат'] },
                },
            },
        }]

        const { rows, headers } = buildCallsExportSheet(reports, t)

        expect(headers).toContain('Саммари')
        expect(headers).toContain('Качество приветствия')
        expect(headers.some(h => h.includes('Запрос возврата'))).toBe(true)

        expect(rows[0]['Саммари']).toBe('Развёрнутое саммари')
        expect(rows[0]['Качество приветствия']).toBe(80)
        expect(rows[0]['Результат']).toBe('Успех')
        expect(rows[0]['Транскрипт']).toContain('возврат')
        expect(String(rows[0]['Обоснование метрик'])).toContain('Вежливое приветствие')
    })

    it('includes bot-call nested metrics when present', () => {
        const reports: Report[] = [{
            id: '2',
            channelId: '2',
            callerId: '100',
            userId: '1',
            createdAt: '2026-06-19T11:00:00Z',
            analytics: {
                channelId: '2',
                metrics: {
                    scenario_analysis: {
                        success: false,
                        summary: 'Bot summary',
                        escalation_reason: 'Complex case',
                    },
                    business_impact: { automation_rate: 42 },
                    accuracy_and_efficiency: { intent_recognition_rate: 88 },
                },
            },
        }]

        const { rows } = buildCallsExportSheet(reports, t)

        expect(rows[0]['Саммари']).toBe('Bot summary')
        expect(rows[0]['Результат']).toBe('Эскалация')
        expect(rows[0]['Уровень автоматизации']).toBe(42)
        expect(rows[0]['Распознавание намерений']).toBe(88)
    })
})
