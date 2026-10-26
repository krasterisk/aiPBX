import { fireEvent, render, screen } from '@testing-library/react'
import { PreviewMetricCalls } from './PreviewMetricCalls'

const mockQuery = jest.fn()
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }) }))
jest.mock('@/entities/Report', () => ({ useGetOperatorEvidence: (args: unknown) => mockQuery(args) }))
const entry: any = { kind: 'operatorMetric', metricId: 'politeness_empathy', operatorId: '203', operatorAccountId: '99' }
const filters = { projectId: '5', sources: '["external-api"]', tagIds: '["a","b"]', callTypes: '["incoming"]' }

it('keeps scoped filters and native metric semantics while opening calls and changing pages', () => {
    mockQuery.mockReturnValue({ currentData: { metrics: [{ metricId: entry.metricId, average: 90, sampleSize: 21, evidenceTotal: 21, evidencePageSize: 10, evidence: [{ channelId: 'saved-call', createdAt: '2026-10-26T07:00:00Z', value: 90, quote: 'Synthetic quote', rationale: 'Synthetic rationale' }] }] } })
    const onOpen = jest.fn()
    const onPage = jest.fn()
    render(<PreviewMetricCalls entry={entry} filters={filters} page={2} onPage={onPage} onOpen={onOpen} />)
    expect(mockQuery).toHaveBeenLastCalledWith(expect.objectContaining({ ...filters, userId: '99', operatorId: '203', metricId: entry.metricId, evidencePage: 2, evidencePageSize: 10, order: 'worst' }))
    fireEvent.click(screen.getByRole('button', { name: /Synthetic quote/ }))
    expect(onOpen).toHaveBeenCalledWith('saved-call')
    expect(screen.getByText('Synthetic rationale')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'next' }))
    expect(onPage).toHaveBeenCalledWith(3)
})

it('shows retry when the evidence request fails', () => {
    const refetch = jest.fn()
    mockQuery.mockReturnValue({ isError: true, refetch })
    render(<PreviewMetricCalls entry={entry} filters={filters} page={1} onPage={jest.fn()} onOpen={jest.fn()} />)
    expect(screen.getByRole('alert')).toHaveTextContent('loadError')
    fireEvent.click(screen.getByRole('button', { name: 'retry' }))
    expect(refetch).toHaveBeenCalledTimes(1)
})
