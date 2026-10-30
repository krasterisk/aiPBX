import { fireEvent, render, screen } from '@testing-library/react'
import { OperatorDashboardPreview } from './OperatorDashboardPreview'

jest.mock('./DashboardInsights', () => ({ DashboardInsights: () => <section data-testid="insights" /> }))
const summary = jest.fn()
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'en' }
    })
}))
jest.mock('@/entities/Report', () => ({ WITHOUT_PROJECT_FILTER: 'none', useQualityDashboardQuery: (...args: any[]) => summary(...args) }))
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
    sentimentDistribution: { positive: 29.83, neutral: 69.08, negative: 1.09 },
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
    filters: { projectId: '5', userId: '99', startDate: '2026-10-24' },
    projects: [],
    onProjectChange: jest.fn(),
    onRetry: jest.fn()
}

beforeEach(() => {
    summary.mockReturnValue({ currentData: data, isFetching: false })
})

it('refreshes selected operators in the background without hiding cards or resetting nested panels', () => {
    const view = render(<OperatorDashboardPreview {...props} />)
    fireEvent.click(screen.getByRole('button', { name: 'operator', expanded: false }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Operator' }))
    fireEvent.click(screen.getByRole('button', { name: /^calls 7 analyzed/ }))
    fireEvent.click(screen.getByRole('button', { name: 'page2' }))
    fireEvent.click(screen.getByRole('button', { name: 'call', exact: true }))
    const panel = screen.getByTestId('panel-entry')
    summary.mockReturnValue({ currentData: data, isFetching: true })
    view.rerender(<OperatorDashboardPreview {...props} />)
    expect(screen.queryByText('loading', { exact: true })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^calls 7 analyzed/ })).toBeInTheDocument()
    expect(screen.getByTestId('panel-entry')).toBe(panel)
    expect(JSON.parse(panel.textContent!).channelId).toBe('native-id')
    expect(summary).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ pollingInterval: 60000, skip: false }))
    summary.mockReturnValue({ currentData: { ...data, totalAnalyzed: 8 }, isFetching: false })
    view.rerender(<OperatorDashboardPreview {...props} />)
    expect(screen.getByRole('button', { name: /^calls 8 analyzed/ })).toBeInTheDocument()
    expect(screen.getByTestId('panel-entry')).toBe(panel)
    fireEvent.click(screen.getByRole('button', { name: 'back', exact: true }))
    expect(JSON.parse(screen.getByTestId('panel-entry').textContent!).page).toBe(2)
    summary.mockReturnValue({ currentData: data, isFetching: false, isError: true })
    view.rerender(<OperatorDashboardPreview {...props} />)
    expect(screen.queryByText('loadError')).not.toBeInTheDocument()
    expect(JSON.parse(screen.getByTestId('panel-entry').textContent!).page).toBe(2)
})

it('omits the bottom calls list while retaining call drilldowns from summary cards', () => {
    render(<OperatorDashboardPreview {...props} />)
    expect(screen.queryByRole('heading', { name: 'calls', exact: true })).not.toBeInTheDocument()
    expect(screen.queryByTestId('main-query')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /^calls 7 analyzed/ }))
    expect(JSON.parse(screen.getByTestId('panel-entry').textContent!).query).toEqual(expect.objectContaining(props.filters))
})

it('hides the empty unassigned bucket while preserving configured zero-count topics', () => {
    render(<OperatorDashboardPreview {...props} data={{
        ...data,
        operatorTopicStats: {
            ...data.operatorTopicStats,
            topics: [
                ...data.operatorTopicStats.topics,
                { tagId: 'configured', name: 'Configured', callsCount: 0 },
                { tagId: null, name: '', callsCount: 0 }
            ]
        }
    }} />)
    expect(screen.queryByText('withoutTopic')).not.toBeInTheDocument()
    expect(screen.getByText('Configured')).toBeInTheDocument()
    expect(screen.getByText('Service')).toBeInTheDocument()
})

it('labels nonempty unassigned calls and preserves the unassigned drilldown', () => {
    render(<OperatorDashboardPreview {...props} data={{
        ...data,
        operatorTopicStats: { ...data.operatorTopicStats, topics: [{ tagId: null, name: '', callsCount: 2 }] }
    }} />)
    fireEvent.click(screen.getByText('withoutTopic'))
    const entry = JSON.parse(screen.getByTestId('panel-entry').textContent!)
    expect(entry.title).toBe('withoutTopic')
    expect(entry.query).toEqual(expect.objectContaining({ withoutTopic: true, projectId: '5', userId: '99' }))
    expect(entry.query.tagId).toBeUndefined()
})

it('uses a visible fallback for unnamed configured topics without losing their ID', () => {
    render(<OperatorDashboardPreview {...props} data={{
        ...data,
        operatorTopicStats: { ...data.operatorTopicStats, topics: [{ tagId: 'unnamed', name: '  ', callsCount: 1 }] }
    }} />)
    fireEvent.click(screen.getByText('unnamedTopic'))
    expect(JSON.parse(screen.getByTestId('panel-entry').textContent!).query.tagId).toBe('unnamed')
})

it('displays API sentiment percentages without rescaling and preserves sentiment filtering', () => {
    render(<OperatorDashboardPreview {...props} />)
    expect(screen.getByText('29.83%')).toBeInTheDocument()
    expect(screen.getByText('69.08%')).toBeInTheDocument()
    expect(screen.getByText('1.09%')).toBeInTheDocument()
    expect(screen.getByText('29.83%').closest('button')?.querySelector('[data-tone]')).toHaveAttribute('data-tone', 'high')
    expect(screen.getByText('69.08%').closest('button')?.querySelector('[data-tone]')).toHaveAttribute('data-tone', 'none')
    expect(screen.getByText('1.09%').closest('button')?.querySelector('[data-tone]')).toHaveAttribute('data-tone', 'low')
    fireEvent.click(screen.getByText('1.09%').closest('button')!)
    expect(JSON.parse(screen.getByTestId('panel-entry').textContent!).query.sentiment).toBe('negative')
})

it('colors metric dots consistently and respects negative and neutral custom metrics', () => {
    const project: any = {
 id: '5',
customMetricsSchema: [
        { id: 'conflict', name: 'Conflict', type: 'boolean', polarity: 'negative', description: '' },
        { id: 'kind', name: 'Kind', type: 'enum', description: '' }
    ] 
}
    render(<OperatorDashboardPreview {...props} project={project} data={{
 ...data,
        aggregatedMetrics: { greeting_quality: 86, script_compliance: 65, politeness_empathy: 42 },
        customMetricsAggregated: { conflict: { type: 'boolean', value: 10 }, kind: { type: 'enum', distribution: { Phone: 3, Email: 1 } } }
    }} />)
    expect(screen.getByText('86%').closest('[data-tone]')).toHaveAttribute('data-tone', 'high')
    expect(screen.getByText('65%').closest('[data-tone]')).toHaveAttribute('data-tone', 'medium')
    expect(screen.getByText('42%').closest('[data-tone]')).toHaveAttribute('data-tone', 'low')
    expect(screen.getByText('Conflict').closest('button')?.querySelector('[data-tone]')).toHaveAttribute('data-tone', 'high')
    expect(screen.getByText('Phone · 75%').closest('[data-tone]')).toHaveAttribute('data-tone', 'none')
})

it('keeps the cabinet and stable operator ID in filtered summary and call queries', () => {
    render(<OperatorDashboardPreview {...props} />)
    fireEvent.click(screen.getByRole('button', { name: 'operator', expanded: false }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Operator' }))
    const selection = JSON.stringify([{ userId: '99', operatorId: '218' }])
    expect(summary).toHaveBeenLastCalledWith(
        expect.objectContaining({ projectId: '5', userId: '99', operatorFilters: selection }),
        expect.objectContaining({ skip: false })
    )
    fireEvent.click(screen.getByRole('button', { name: /Service/ }))
    expect(JSON.parse(screen.getByTestId('panel-entry').textContent!).query).toEqual(
        expect.objectContaining({ userId: '99', projectId: '5', operatorFilters: selection })
    )
})

it('opens topic calls with tagId and restores the previous page when leaving a call', () => {
    render(<OperatorDashboardPreview {...props} />)
    fireEvent.click(screen.getByRole('button', { name: /Service/ }))
    expect(JSON.parse(screen.getByTestId('panel-entry').textContent!).query).toEqual(
        expect.objectContaining({ tagId: 'service', projectId: '5', userId: '99' })
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
            filters={{
                ...props.filters,
                startDate: new Date(2026, 9, 24).toISOString(),
                endDate: new Date(2026, 9, 24, 23, 59, 59, 999).toISOString()
            }}
        />
    )
    expect(screen.getByText('byHour')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    expect(JSON.parse(screen.getByTestId('panel-entry').textContent!).query).toEqual(
        expect.objectContaining({ startDate: point.label, endDate: new Date(Date.parse(point.label) + 3600000 - 1).toISOString() })
    )
    view.rerender(<OperatorDashboardPreview {...props} data={hourlyData} filters={{ ...props.filters, endDate: '2026-10-25' }} />)
    expect(screen.queryByText('byHour')).not.toBeInTheDocument()
})

it('only shows the included low-recognition notice to admins', () => {
    const view = render(<OperatorDashboardPreview {...props} data={{ ...data, excludedLowQualityCount: 3 }} />)
    expect(screen.queryByText('lowQualityAdminHint')).not.toBeInTheDocument()
    view.rerender(<OperatorDashboardPreview {...props} data={{ ...data, excludedLowQualityCount: 3 }} isAdmin />)
    expect(screen.getByText('lowQualityAdminHint')).toBeInTheDocument()
})
it('selects multiple identities and retains the same union on every drilldown', () => {
    const extra = { ...data.agentScorecards[0], operatorId: '203', operatorName: 'Second' }
    render(<OperatorDashboardPreview {...props} data={{ ...data, agentScorecards: [...data.agentScorecards, extra] }} />)
    fireEvent.click(screen.getByRole('button', { name: 'operator', expanded: false }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Operator' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Second' }))
    const selected = JSON.parse(summary.mock.calls.at(-1)[0].operatorFilters)
    expect(selected).toEqual([
        { userId: '99', operatorId: '218' },
        { userId: '99', operatorId: '203' }
    ])
    fireEvent.click(screen.getByRole('button', { name: /Service/ }))
    expect(JSON.parse(JSON.parse(screen.getByTestId('panel-entry').textContent!).query.operatorFilters)).toEqual(selected)
})
it('sorts operators by score descending by default and reverses on header activation', () => {
    const rows = [
        { ...data.agentScorecards[0], operatorName: 'Low', averageScore: 20 },
        { ...data.agentScorecards[0], operatorId: '203', operatorName: 'High', averageScore: 90 }
    ]
    render(<OperatorDashboardPreview {...props} data={{ ...data, agentScorecards: rows }} />)
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('High')
    fireEvent.click(screen.getByRole('button', { name: 'score', exact: true }))
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Low')
})
it('opens call-type segments using exact bucket and type filters', () => {
    const point = {
        label: new Date(2026, 9, 24, 13).toISOString(),
        callsCount: 4,
        avgScore: 75,
        avgDuration: 60,
        byCallType: { incoming: 2, outgoing: 1, internal: 1 }
    }
    render(
        <OperatorDashboardPreview
            {...props}
            data={{ ...data, timeSeries: { daily: [], monthly: [], hourly: [point] } }}
            filters={{
                ...props.filters,
                startDate: new Date(2026, 9, 24).toISOString(),
                endDate: new Date(2026, 9, 24, 23, 59, 59, 999).toISOString()
            }}
        />
    )
    fireEvent.click(screen.getByRole('button', { name: /^type_outgoing: 1/ }))
    expect(JSON.parse(screen.getByTestId('panel-entry').textContent!).query).toEqual(
        expect.objectContaining({
            callType: 'outgoing',
            startDate: point.label,
            endDate: new Date(Date.parse(point.label) + 3600000 - 1).toISOString()
        })
    )
})

it('fits all 24 hourly buckets and keeps afternoon calls accessible after an empty night', () => {
    const hourly = Array.from({ length: 24 }, (_, hour) => ({
        label: new Date(2026, 9, 24, hour).toISOString(),
        callsCount: hour === 14 ? 3 : 0,
        avgScore: 75,
        avgDuration: 60,
        byCallType: { incoming: hour === 14 ? 3 : 0, outgoing: 0, internal: 0 }
    }))
    const { container } = render(<OperatorDashboardPreview {...props}
        data={{ ...data, timeSeries: { daily: [], monthly: [], hourly } }}
        filters={{ ...props.filters, startDate: new Date(2026, 9, 24).toISOString(), endDate: new Date(2026, 9, 24, 23, 59, 59, 999).toISOString() }}
    />)
    const chart = container.querySelector('[data-unit="hour"]')!
    expect(chart).toHaveStyle({ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' })
    expect(chart.querySelectorAll('[data-axis-label="true"]')).toHaveLength(6)
    expect(screen.queryByText('hourlyHint')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /^type_incoming: 3/ }))
    expect(JSON.parse(screen.getByTestId('panel-entry').textContent!).query).toEqual(expect.objectContaining({
        callType: 'incoming',
        startDate: hourly[14].label,
        endDate: new Date(Date.parse(hourly[14].label) + 3600000 - 1).toISOString()
    }))
})

it('shows exact outcome counts rather than reconstructing rounded rates, including unknown outcomes', () => {
    render(<OperatorDashboardPreview {...props} data={{ ...data, totalAnalyzed: 100, successRate: 99.99, successfulCount: 1, unsuccessfulCount: 2, unknownOutcomeCount: 97 }} />)
    const yes = screen.getByRole('button', { name: 'successful 1' })
    const no = screen.getByRole('button', { name: 'unsuccessful 2' })
    expect(yes).toBeInTheDocument(); expect(no).toBeInTheDocument()
    fireEvent.click(yes)
    expect(JSON.parse(screen.getByTestId('panel-entry').textContent!).query).toMatchObject({ ...props.filters, success: true })
    fireEvent.click(screen.getByRole('button', { name: 'outcomeUnknown 97' }))
    expect(JSON.parse(screen.getByTestId('panel-entry').textContent!).query).toMatchObject({ ...props.filters, withoutOutcome: true })
})

it('only mounts new insights when explicitly enabled', () => {
    const view = render(<OperatorDashboardPreview {...props} />)
    expect(screen.queryByTestId('insights')).not.toBeInTheDocument()
    view.rerender(<OperatorDashboardPreview {...props} insightsEnabled />)
    expect(screen.getByTestId('insights')).toBeInTheDocument()
})
