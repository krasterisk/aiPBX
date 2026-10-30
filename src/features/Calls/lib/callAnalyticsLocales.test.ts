import fs from 'fs'
import path from 'path'
import { createInstance } from 'i18next'
import type { Report } from '@/entities/Report'
import { journalMetrics } from './journalDetailModel'
import { buildCallsExportSheet } from './qualityCallsExportSheet'

const languages = ['ru', 'en', 'de', 'zh']
const namespaces = ['reports', 'quality-journal', 'call-records-preview', 'dashboard-insights', 'quality-score']
const resources = Object.fromEntries(languages.map(language => [language, Object.fromEntries(namespaces.map(namespace => [namespace,
    JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../../public/locales', language, `${namespace}.json`), 'utf8')) as Record<string, string>
]))]))
const parameters = (value: string) => Array.from(value.matchAll(/\{\{\s*([^{}]+?)\s*\}\}/g)).map(match => match[1]).sort()

describe('call journal and dashboard localization contract', () => {
    it.each(languages)('has complete interface namespaces and matching interpolation parameters in %s', language => {
        for (const namespace of namespaces.filter(namespace => namespace !== 'reports')) {
            const dictionary = resources[language][namespace]
            expect(Object.keys(dictionary).sort()).toEqual(Object.keys(resources.ru[namespace]).sort())
            for (const [key, value] of Object.entries(dictionary)) {
                expect(typeof value).toBe('string')
                expect(value.trim()).not.toBe('')
                expect(parameters(value)).toEqual(parameters(resources.ru[namespace][key]))
            }
        }
    })

    it.each(languages)('resolves all assistant metric labels and operation labels without fallback in %s', language => {
        const report = {
            analytics: {
                metrics: {
                    greeting_quality: 80,
                    custom_metrics: {},
                    business_impact: { escalation_rate: 0.2, automation_rate: 0.8, cost_savings_estimated: 20 },
                    accuracy_and_efficiency: { average_turns: 5, dialog_completion_rate: 0.9, entity_extraction_rate: 0.8, context_retention_score: 90, intent_recognition_rate: 0.9 },
                    speech_and_interaction_quality: { mos: 4, wer_estimated: 0.02, self_recovery_rate: 0.8, response_latency_score: 90 },
                    user_satisfaction: { frustration_detected: false, bail_out_rate: false }
                }
            }
        } as unknown as Report
        const dictionary = resources[language].reports
        for (const key of [...journalMetrics(report).map(metric => metric.label), 'analytic', 'analytic_regen', 'analytic_regen_free', 'realtime', 'Скрыть прогресс обработки']) {
            expect(Object.prototype.hasOwnProperty.call(dictionary, key)).toBe(true)
            expect(dictionary[key].trim()).not.toBe('')
            if (language !== 'ru') expect(dictionary[key]).not.toMatch(/[А-Яа-яЁё]/)
        }
    })

    it.each(languages)('localizes XLSX quality headings and keeps their values under the same translated columns in %s', language => {
        const i18n = createInstance()
        void i18n.init({ resources, lng: language, fallbackLng: false, initImmediate: false })
        const t = i18n.getFixedT(language, 'reports')
        const report = { id: 'one', channelId: 'one', createdAt: '', analytics: { qualityStatus: 'scored', qualityScore: 47.25, qualityCoverage: 0.8, qualityContextIncomplete: false } } as Report
        const sheet = buildCallsExportSheet([report], t)
        const dictionary = resources[language].reports
        for (const key of ['EXPORT_CSAT', 'EXPORT_QUALITY_SCORE', 'EXPORT_QUALITY_STATUS', 'EXPORT_EVIDENCE_COVERAGE', 'EXPORT_QUALITY_FORMULA', 'EXPORT_QUALITY_REVISION', 'EXPORT_HISTORICAL_CONTEXT_INCOMPLETE']) {
            expect(dictionary[key]).toEqual(expect.any(String))
            expect(sheet.headers).toContain(dictionary[key])
            expect(Object.prototype.hasOwnProperty.call(sheet.rows[0], dictionary[key])).toBe(true)
        }
        expect(sheet.rows[0][dictionary.EXPORT_QUALITY_SCORE]).toBe(47.25)
        expect(sheet.rows[0][dictionary.EXPORT_EVIDENCE_COVERAGE]).toBe(80)
    })
})
