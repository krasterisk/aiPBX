import { render, screen } from '@testing-library/react'
import { PreviewDatePresets } from './PreviewDatePresets'

let mockLanguage = 'en'
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { language: mockLanguage } }) }))

it.each(['ru', 'en', 'de', 'zh'])('formats dashboard dates in the selected UI language %s', language => {
    mockLanguage = language
    const value = { startDate: '2026-10-26T09:00:00Z', endDate: '2026-10-27T09:00:00Z' }
    render(<PreviewDatePresets value={value} onChange={jest.fn()} />)
    const range = `${new Date(value.startDate).toLocaleDateString(language)} — ${new Date(value.endDate).toLocaleDateString(language)}`
    expect(screen.getByText(range)).toBeInTheDocument()
})
