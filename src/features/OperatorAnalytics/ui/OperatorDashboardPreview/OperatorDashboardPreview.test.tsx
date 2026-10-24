import { fireEvent, render, screen } from '@testing-library/react'
import { OperatorDashboardPreview } from './OperatorDashboardPreview'

const summary = jest.fn()
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }) }))
jest.mock('@/entities/Report', () => ({ WITHOUT_PROJECT_FILTER: 'none', useGetOperatorDashboard: (...args: any[]) => summary(...args) }))
jest.mock('@/shared/ui/redesign-v3', () => ({
    SidePanel: ({ isOpen, onBack, onClose, title, children }: any) =>
        isOpen ? (
            <div role="dialog">
                <h2>{title}</h2>
                {onBack && <button onClick={onBack}>back</button>}
                <button onClick={onClose}>close</button>
                {children}
            </div>
        ) : null
}))
jest.mock('./PreviewPanel', () => ({
    callsEntry: (title: string, query: any, topicId?: string) => ({
        kind: 'calls',
        title,
        query,
        topicId,
        page: 1,
        search: '',
        tab: 'calls'
    }),
    PreviewMainCalls: ({ query }: any) => <output data-testid="main-query">{JSON.stringify(query)}</output>,
    PreviewPanel: ({ entry, update, open }: any) => (
        <>
            <output data-testid="panel-entry">{JSON.stringify(entry)}</output>
            <button onClick={() => update({ ...entry, page: 2 })}>page2</button>
            <button onClick={() => open({ kind: 'call', title: 'Call', channelId: 'native-id' })}>call</button>
        </>
    )
}))

const data: any = {
    totalAnalyzed: 7,
    averageScore: 78,
    averageDuration: 72,
    successRate: 0.71,
    totalCost: 1,
    aggregatedMetrics: {},
    sentimentDistribution: { positive: 4, neutral: 2, negative: 1 },
    timeSeries: { daily: [], monthly: [] },
    agentScorecards: [
        {
            operatorId: '218',
            operatorAccountId: '99',
            operatorName: 'Operator',
            callsCount: 7,
            averageScore: 78,
            successRate: 0.71,
            negativeRate: 10,
            avgCsat: null
        }
    ],
    operatorTopicStats: {
        totalCalls: 7,
        hasMultipleTopics: false,
        topics: [{ tagId: 'service', name: 'Service', callsCount: 7 }],
        operators: []
    }
}
const props = {
    data,
    loading: false,
    error: false,
    filters: { projectId: '5', userId: 'admin-scope', startDate: '2026-10-24' },
    projects: [],
    onProjectChange: jest.fn(),
    onRetry: jest.fn()
}

beforeEach(() => {
    summary.mockReturnValue({ currentData: data, isFetching: false })
})

it('keeps the cabinet and stable operator ID in filtered summary and call queries', () => {
    render(<OperatorDashboardPreview {...props} />)
    fireEvent.change(screen.getByLabelText('operator'), { target: { value: JSON.stringify(['99', '218', 'Operator']) } })
    expect(summary).toHaveBeenLastCalledWith(
        expect.objectContaining({ projectId: '5', userId: '99', operatorId: '218' }),
        expect.objectContaining({ skip: false })
    )
    expect(JSON.parse(screen.getByTestId('main-query').textContent!)).toEqual(
        expect.objectContaining({ userId: '99', operatorId: '218', projectId: '5' })
    )
})

it('opens topic calls with tagId and restores the previous page when leaving a call', () => {
    render(<OperatorDashboardPreview {...props} />)
    fireEvent.click(screen.getByRole('button', { name: /Service/ }))
    expect(JSON.parse(screen.getByTestId('panel-entry').textContent!).query).toEqual(
        expect.objectContaining({ tagId: 'service', projectId: '5', userId: 'admin-scope' })
    )
    fireEvent.click(screen.getByText('page2'))
    fireEvent.click(screen.getByText('call'))
    expect(JSON.parse(screen.getByTestId('panel-entry').textContent!).channelId).toBe('native-id')
    fireEvent.click(screen.getByText('back'))
    expect(JSON.parse(screen.getByTestId('panel-entry').textContent!).page).toBe(2)
})

it('separates failures from empty data and never renders stale panels', () => {
    render(<OperatorDashboardPreview {...props} error />)
    expect(screen.getByRole('alert')).toHaveTextContent('loadError')
    expect(screen.queryByTestId('main-query')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'retry' }))
    expect(props.onRetry).toHaveBeenCalled()
})

it('offers hourly buckets only for a single selected day and sends exact hour bounds', () => {
    const point = { label: new Date(2026, 9, 24, 13).toISOString(), callsCount: 2, avgScore: 70, avgDuration: 60 }
    const hourlyData = { ...data, timeSeries: { daily: [], monthly: [], hourly: [point] } }
    const view = render(
        <OperatorDashboardPreview
            {...props}
            data={hourlyData}
            filters={{ ...props.filters, startDate: new Date(2026, 9, 24).toISOString(), endDate: new Date(2026, 9, 24, 23, 59, 59, 999).toISOString() }}
        />
    )
    expect(screen.getByText('byHour')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /^2 / }))
    expect(JSON.parse(screen.getByTestId('panel-entry').textContent!).query).toEqual(
        expect.objectContaining({ startDate: point.label, endDate: new Date(Date.parse(point.label) + 3600000 - 1).toISOString() })
    )
    view.rerender(<OperatorDashboardPreview {...props} data={hourlyData} filters={{ ...props.filters, endDate: '2026-10-25' }} />)
    expect(screen.queryByText('byHour')).not.toBeInTheDocument()
})
