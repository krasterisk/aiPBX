import { act, fireEvent, render, screen } from '@testing-library/react'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { AiInsightsBanner } from './AiInsightsBanner'

const mockTrigger = jest.fn()
let mockData: unknown

jest.mock('@/entities/Report', () => ({
    useLazyGetOperatorInsights: () => [mockTrigger, { data: mockData }],
}))

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
}))

describe('AiInsightsBanner metric labels', () => {
    beforeEach(() => { mockData = undefined })

    it('translates API evidence and updates it when the UI language changes', async () => {
        const i18n = createInstance()
        await i18n.init({
            lng: 'ru',
            fallbackLng: 'en',
            resources: {
                ru: { reports: { 'Неуспешные звонки': 'Неуспешные звонки' } },
                en: { reports: { 'Неуспешные звонки': 'Unsuccessful calls' } },
                de: { reports: { 'Неуспешные звонки': 'Erfolglose Anrufe' } },
            },
        })
        const banner = () => (
            <I18nextProvider i18n={i18n}>
                <AiInsightsBanner queryParams={{}} />
            </I18nextProvider>
        )
        const { rerender } = render(banner())
        fireEvent.click(screen.getByRole('button', { name: 'Получить инсайты' }))
        mockData = {
            insights: [{
                priority: 'high',
                type: 'gap',
                title: 'Unsuccessful calls',
                observation: 'Unsuccessful calls: 129.',
                recommendation: 'Review Unsuccessful calls.',
                evidence: { metric: 'Unsuccessful calls', value: 129 },
            }],
        }
        rerender(banner())
        expect(screen.getByText('Неуспешные звонки: 129')).toBeInTheDocument()
        expect(screen.getByText('Неуспешные звонки: 129.')).toBeInTheDocument()
        expect(screen.getByText('Review Неуспешные звонки.')).toBeInTheDocument()

        // A language switch must translate existing cached insights as well.
        await act(async () => { await i18n.changeLanguage('de') })
        expect(screen.getByText('Erfolglose Anrufe: 129')).toBeInTheDocument()
        expect(screen.queryByText('Неуспешные звонки: 129')).not.toBeInTheDocument()
    })
})
