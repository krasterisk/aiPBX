import { readFileSync } from 'fs'
import path from 'path'
import { createInstance } from 'i18next'
import { applyInsightMetricNames, createInsightMetricNames, insightMetricLabel, INSIGHT_METRICS } from './insightMetrics'

const languages = ['ru', 'en', 'de', 'zh']
const resources = Object.fromEntries(languages.map(language => [language, {
    reports: JSON.parse(readFileSync(path.resolve(__dirname, '../../../../public/locales', language, 'reports.json'), 'utf8')) as Record<string, string>,
}]))

function namesFor(language: string, customNames?: Record<string, string>) {
    const i18n = createInstance()
    void i18n.init({ resources, lng: language, fallbackLng: 'en', initImmediate: false })
    return createInsightMetricNames(
        key => String(i18n.t(key, { ns: 'reports' })),
        key => String(i18n.getFixedT('en', 'reports')(key)),
        customNames,
    )
}

describe('insight metric localization', () => {
    it.each(languages)('has explicit translations for every built-in metric in %s', language => {
        const dictionary = resources[language].reports
        const names = namesFor(language)
        for (const { labelKey, aliases } of INSIGHT_METRICS) {
            expect(dictionary[labelKey]).toEqual(expect.any(String))
            expect(dictionary[labelKey].trim()).not.toBe('')
            for (const alias of [...aliases, labelKey, resources.en.reports[labelKey]]) {
                expect(insightMetricLabel(alias, names)).toBe(dictionary[labelKey])
            }
        }
    })

    it('localizes the reported API evidence label and raw summary IDs', () => {
        const names = namesFor('ru')
        expect(`${insightMetricLabel('Unsuccessful calls', names)}: 129`).toBe('Неуспешные звонки: 129')
        expect(insightMetricLabel(' unsuccessful calls ', names)).toBe('Неуспешные звонки')
        expect(insightMetricLabel('greeting_quality', names)).toBe('Качество приветствия')
        expect(insightMetricLabel('avgScore', names)).toBe('Средний балл')
        expect(insightMetricLabel('successRatePp', names)).toBe('Изменение доли успешных обращений (п. п.)')
    })

    it('localizes metric references throughout generated insight text', () => {
        expect(applyInsightMetricNames('Unsuccessful calls: 129; avgScore: 80; Greeting Quality: 90.', namesFor('ru')))
            .toBe('Неуспешные звонки: 129; Средний балл: 80; Качество приветствия: 90.')
        expect(applyInsightMetricNames('Качество приветствия: 90', namesFor('de')))
            .toBe(`${resources.de.reports['Качество приветствия']}: 90`)
    })

    it('preserves project names and unknown labels, with literal and whole-token replacements', () => {
        const names = namesFor('ru', { 'custom.a+b': 'Цена $& avgScore', avgScore: 'Оценка проекта' })
        expect(insightMetricLabel('avgScore', names)).toBe('Оценка проекта')
        expect(insightMetricLabel('Новая метрика проекта', names)).toBe('Новая метрика проекта')
        expect(applyInsightMetricNames('custom.a+b: 5; customXaab: 6; my_avgScore: 7', names))
            .toBe('Цена $& avgScore: 5; customXaab: 6; my_avgScore: 7')
    })
})
