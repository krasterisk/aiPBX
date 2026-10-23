import { fireEvent, render, screen } from '@testing-library/react'
import { ApiDocs } from './OperatorApiTokens'

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

describe('Analytics API documentation', () => {
    it('documents all external ingestion paths and valid JSON examples', () => {
        const { container } = render(<ApiDocs />)
        for (const button of screen.getAllByRole('button', { expanded: false })) fireEvent.click(button)
        expect(screen.getByText('/operator-analytics/analyze')).toBeInTheDocument()
        expect(screen.getByText('/operator-analytics/analyze-file')).toBeInTheDocument()
        expect(screen.getByText('/operator-analytics/analyze-url')).toBeInTheDocument()
        const examples = Array.from(container.querySelectorAll('pre')).map(el => el.textContent ?? '')
            .filter(text => text.startsWith('{')).map(text => JSON.parse(text))
        expect(examples).toEqual(expect.arrayContaining([
            expect.objectContaining({ callType: 'outgoing', sync: false, url: expect.any(String) }),
            expect.objectContaining({ file: 'BASE64_AUDIO', filename: 'call.mp3' }),
            expect.objectContaining({ batchId: expect.any(String), items: expect.any(Array) }),
            expect.objectContaining({ channelId: '42', callType: 'outgoing', analytics: expect.objectContaining({ csat: 4 }) })
        ]))
        expect(screen.getByText('apiDocsPolling')).toBeInTheDocument()
        expect(screen.getByText('apiDocsBatchAuth')).toBeInTheDocument()
    })
})
