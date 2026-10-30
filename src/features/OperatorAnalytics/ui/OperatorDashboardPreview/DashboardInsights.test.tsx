import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { DashboardInsights } from './DashboardInsights'

const generate = jest.fn()
jest.mock('@/entities/Report', () => ({ useLazyQualityInsightsQuery: () => [generate] }))
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en', getFixedT: () => (k: string) => k } }) }))
jest.mock('@/shared/ui/redesign-v3', () => ({ SidePanel: ({ isOpen, children, onBack }: any) => isOpen ? <div role="dialog">{onBack && <button onClick={onBack}>back</button>}{children}</div> : null }))
const response: any = { generatedAt: '2026-10-29T00:00:00Z', sampleSize: 22, insights: [{ type: 'gap', priority: 'high', title: 'Finding', observation: 'Observation', recommendation: 'Action', evidence: { channelIds: ['native-1'] } }] }
beforeEach(() => generate.mockReset())

it('generates only on request with every filter, then opens the shared native call detail', async () => {
    const filters = { userId: '99', projectId: '5', startDate: '2026-10-26', endDate: '2026-10-26', people: '[{"userId":"99","operatorId":"207"}]', sources: '["call"]', callTypes: '["incoming"]', tagIds: '["booking"]', csat: '4,5', operatorFilters: '[{"operatorId":"207"}]' }
    generate.mockReturnValue({ unwrap: async () => response })
    render(<DashboardInsights filters={filters} total={22} renderCallDetail={id => <p>detail:{id}</p>} />)
    expect(generate).not.toHaveBeenCalled()
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'generate' })) })
    expect(generate).toHaveBeenCalledWith({ ...filters, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, refresh: false }, false)
    fireEvent.click(screen.getByText('evidence'))
    fireEvent.click(screen.getByText('example'))
    expect(screen.getByText('detail:native-1')).toBeInTheDocument()
    fireEvent.click(screen.getByText('back'))
    expect(within(screen.getByRole('dialog')).getByText('Observation', { selector: 'p' })).toBeInTheDocument()
})

it('discards a late response after filters change and never generates automatically', async () => {
    let complete: (data: any) => void = () => {}
    generate.mockReturnValue({ unwrap: async () => await new Promise(resolve => { complete = resolve }) })
    const { rerender } = render(<DashboardInsights filters={{ projectId: '5' }} total={22} />)
    fireEvent.click(screen.getByRole('button', { name: 'generate' }))
    rerender(<DashboardInsights filters={{ projectId: '6' }} total={22} />)
    await act(async () => { complete(response) })
    expect(screen.queryByText('Finding')).not.toBeInTheDocument()
    expect(generate).toHaveBeenCalledTimes(1)
})

it('prevents generation for an empty selection', () => {
    render(<DashboardInsights filters={{}} total={0} />)
    expect(screen.getByRole('button', { name: 'generate' })).toBeDisabled()
    expect(screen.getByText('empty')).toBeInTheDocument()
})

it('keeps the initial block compact and toggles saved results without another generation', async () => {
    generate.mockReturnValue({ unwrap: async () => response })
    const { rerender } = render(<DashboardInsights filters={{ projectId: '5' }} total={22} />)
    expect(screen.getByText('initial')).toBeInTheDocument()
    expect(screen.queryByText('manual')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'collapse' })).not.toBeInTheDocument()
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'generate' })) })
    const collapse = screen.getByRole('button', { name: 'collapse' })
    expect(collapse).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(collapse)
    expect(screen.queryByText('Finding')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'expand' })).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(screen.getByRole('button', { name: 'expand' }))
    expect(screen.getByText('Finding')).toBeInTheDocument()
    expect(generate).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: 'collapse' }))
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'refresh' })) })
    expect(screen.getByText('Finding')).toBeInTheDocument()
    expect(generate).toHaveBeenCalledTimes(2)
    fireEvent.click(screen.getByRole('button', { name: 'collapse' }))
    rerender(<DashboardInsights filters={{ projectId: '6' }} total={22} />)
    expect(screen.getByText('stale')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'expand' })).not.toBeInTheDocument()
    expect(generate).toHaveBeenCalledTimes(2)
})

it('shows applicability and opens exact previous-period evidence with a return to the same comparison', async () => {
    const evidence = { factId: 'verified', value: 45, unit: 'points', assessed: 12, applicable: 14, notApplicable: 3, distribution: { true: 6, false: 6 }, channelIds: ['current-exact'], previousChannelIds: ['previous-exact'], previousValue: 90, delta: -45, previousPeriod: { startDate: '2026-09-01T00:00:00Z', endDate: '2026-09-30T23:59:59Z' } }
    generate.mockReturnValue({ unwrap: async () => ({ ...response, insights: [{ ...response.insights[0], type: 'trend', evidence }] }) })
    render(<DashboardInsights filters={{ projectId: '5' }} total={20} renderCallDetail={id => <p>detail:{id}</p>} />)
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'generate' })) })
    expect(screen.getByText('points')).toBeInTheDocument()
    fireEvent.click(screen.getByText('evidence'))
    expect(screen.getByText('assessed')).toBeInTheDocument()
    expect(screen.getByText('answerYes: 6')).toBeInTheDocument()
    expect(screen.getByText('answerNo: 6')).toBeInTheDocument()
    expect(screen.getByText('90 → 45 points')).toBeInTheDocument()
    expect(screen.getByText('comparison')).toBeInTheDocument()
    fireEvent.click(screen.getByText('previousExample'))
    expect(screen.getByText('detail:previous-exact')).toBeInTheDocument()
    fireEvent.click(screen.getByText('back'))
    expect(screen.getByText('comparison')).toBeInTheDocument()
})
