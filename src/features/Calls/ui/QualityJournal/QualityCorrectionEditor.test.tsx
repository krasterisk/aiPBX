import fs from 'fs'
import path from 'path'
import { render, screen } from '@testing-library/react'
import { QualityCorrectionEditor } from './QualityCorrectionEditor'

let mockLanguage = 'en'
const mockResources = Object.fromEntries(['ru', 'en', 'de', 'zh'].map(language => [language, Object.fromEntries(['reports', 'quality-journal'].map(namespace => [namespace,
    JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../../../public/locales', language, `${namespace}.json`), 'utf8'))
]))]))
jest.mock('react-i18next', () => ({ useTranslation: (namespace: string) => ({ t: (key: string) => mockResources[mockLanguage][namespace][key] ?? key }) }))
jest.mock('@/entities/Report', () => ({
    ...jest.requireActual('@/entities/Report/model/types/quality'),
    useSaveQualityPreviewOverridesMutation: () => [jest.fn(), {}],
    useDeleteQualityPreviewOverrideMutation: () => [jest.fn(), {}]
}))

it.each(['ru', 'en', 'de', 'zh'])('localizes saved boolean and sentiment answers in %s', language => {
    mockLanguage = language
    const detail: any = {
        criteria: [{ id: 'check', origin: 'custom', type: 'boolean', name: 'Patient check' }],
        corrections: [
            { metricId: 'check', origin: 'custom', status: 'assessed', boolValue: false },
            { metricId: 'customer_sentiment', origin: 'summary', status: 'assessed', strValue: 'Positive' }
        ]
    }
    render(<QualityCorrectionEditor channelId="synthetic" detail={detail} />)
    const labels = mockResources[language]['quality-journal']
    expect(screen.getByText(`Patient check · ${labels.no}`)).toBeInTheDocument()
    expect(screen.getByText(`${labels.sentiment} · ${labels.mood_positive}`)).toBeInTheDocument()
    expect(screen.queryByText(/\bfalse\b/)).not.toBeInTheDocument()
})
