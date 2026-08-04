import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DrilldownPanel } from './DrilldownPanel'
import type { OperatorEvidenceResponse, TagStat } from '@/entities/Report'

const mockUseGetOperatorEvidence = jest.fn()
const mockUseGetOperatorCdrs = jest.fn()
const mockUseGetOperatorAnalysis = jest.fn()

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, opts?: Record<string, string | number>) => {
            if (opts?.count != null) return `${key}:${opts.count}`
            if (opts?.page != null && opts?.totalPages != null) return `${key}:${opts.page}:${opts.totalPages}`
            return key
        },
        i18n: { language: 'ru', changeLanguage: jest.fn() },
    }),
}))

jest.mock('@/entities/Report', () => {
    const actual = jest.requireActual('@/entities/Report')
    return {
        ...actual,
        useGetOperatorEvidence: (...args: unknown[]) => mockUseGetOperatorEvidence(...args),
        useGetOperatorCdrs: (...args: unknown[]) => mockUseGetOperatorCdrs(...args),
        useGetOperatorAnalysis: (...args: unknown[]) => mockUseGetOperatorAnalysis(...args),
    }
})

jest.mock('@/entities/Report/ui/ReportShowAnalytics/ReportShowAnalytics', () => ({
    ReportShowAnalytics: () => <div data-testid="report-show-analytics-mock" />,
}))

const evidenceData: OperatorEvidenceResponse = {
    operatorName: 'Alice',
    callsCount: 2,
    scoredCalls: 2,
    averageScore: 75,
    sampleCapped: false,
    metrics: [
        {
            metricId: 'greeting_quality',
            origin: 'default',
            label: 'Greeting',
            average: 70,
            sampleSize: 2,
            evidence: [
                {
                    channelId: 'call-1',
                    createdAt: '2026-07-01T10:00:00.000Z',
                    value: 70,
                    rationale: 'Weak greeting',
                    quote: 'Hi there',
                },
            ],
        },
    ],
}

const defaultFilters = {
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    projectId: 'proj-1',
}

const tagStat: TagStat = {
    tagId: 'tag-sales',
    name: 'Продажи',
    callsCount: 25,
    averageScore: 76,
    successRate: 0.62,
    sentiment: { positive: 12, neutral: 8, negative: 5 },
    shareOfPeriodCalls: 12.5,
    deltaVsPeriodAverage: -2.3,
}

describe('DrilldownPanel tag body', () => {
    beforeEach(() => {
        mockUseGetOperatorCdrs.mockReturnValue({
            data: {
                data: [{ id: 'call-9', filename: 'sales.wav', createdAt: '2026-07-02T10:00:00.000Z' }],
                total: 25,
                page: 1,
                limit: 20,
            },
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: jest.fn(),
        })
    })

    it('renders TagPanelBody for a tag entry', () => {
        render(
            <DrilldownPanel
                entry={{ kind: 'tag', stat: tagStat }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        expect(screen.getByTestId('tag-panel-body')).toBeInTheDocument()
    })

    it('shows call count as the display headline', () => {
        render(
            <DrilldownPanel
                entry={{ kind: 'tag', stat: tagStat }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        expect(screen.getByTestId('tag-panel-headline')).toHaveTextContent('25')
    })

    it('shows D-16 stat strip from the TagStat entry without recomputing', () => {
        render(
            <DrilldownPanel
                entry={{ kind: 'tag', stat: tagStat }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        const strip = screen.getByTestId('tag-panel-stat-strip')
        expect(strip).toHaveTextContent('76.0')
        expect(strip).toHaveTextContent('Positive: 12')
        expect(strip).toHaveTextContent('Neutral: 8')
        expect(strip).toHaveTextContent('Negative: 5')
        expect(strip).toHaveTextContent('62%')
    })

    it('requests calls filtered by theme with dashboard filters', () => {
        render(
            <DrilldownPanel
                entry={{ kind: 'tag', stat: tagStat }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        expect(mockUseGetOperatorCdrs).toHaveBeenCalledWith(
            expect.objectContaining({
                theme: 'tag-sales',
                startDate: '2026-07-01',
                endDate: '2026-07-31',
                projectId: 'proj-1',
                page: 1,
                limit: 20,
            }),
            expect.any(Object),
        )
    })

    it('shows server total in the call list header, not the page length', () => {
        render(
            <DrilldownPanel
                entry={{ kind: 'tag', stat: tagStat }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        expect(screen.getByTestId('tag-panel-call-count')).toHaveTextContent('25')
    })

    it('requests the next page when pagination advances', async () => {
        mockUseGetOperatorCdrs.mockReturnValue({
            data: {
                data: [{ id: 'call-9', filename: 'sales.wav', createdAt: '2026-07-02T10:00:00.000Z' }],
                total: 45,
                page: 1,
                limit: 20,
            },
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: jest.fn(),
        })

        const user = userEvent.setup()
        render(
            <DrilldownPanel
                entry={{ kind: 'tag', stat: tagStat }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        expect(screen.getByTestId('tag-panel-pagination')).toBeInTheDocument()
        await user.click(screen.getByTestId('tag-panel-next-page'))

        expect(mockUseGetOperatorCdrs).toHaveBeenLastCalledWith(
            expect.objectContaining({ page: 2 }),
            expect.any(Object),
        )
    })

    it('shows explicit empty state when the call list has no rows', () => {
        mockUseGetOperatorCdrs.mockReturnValue({
            data: { data: [], total: 0, page: 1, limit: 20 },
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: jest.fn(),
        })

        render(
            <DrilldownPanel
                entry={{ kind: 'tag', stat: tagStat }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        expect(screen.getByTestId('tag-panel-calls-empty')).toBeInTheDocument()
    })

    it('shows inline error with retry on fetch failure', async () => {
        const refetch = jest.fn()
        mockUseGetOperatorCdrs.mockReturnValue({
            data: undefined,
            isLoading: false,
            isFetching: false,
            isError: true,
            refetch,
        })

        const user = userEvent.setup()
        render(
            <DrilldownPanel
                entry={{ kind: 'tag', stat: tagStat }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        expect(screen.getByTestId('tag-panel-error')).toBeInTheDocument()
        await user.click(screen.getByText('Повторить'))
        expect(refetch).toHaveBeenCalled()
    })

    it('opens a call from the theme list via onOpenCall', async () => {
        const onOpenCall = jest.fn()
        const user = userEvent.setup()

        render(
            <DrilldownPanel
                entry={{ kind: 'tag', stat: tagStat }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={onOpenCall}
            />,
        )

        await user.click(screen.getByTestId('tag-call-row-call-9'))
        expect(onOpenCall).toHaveBeenCalledWith('call-9', 'Продажи')
    })
})

describe('DrilldownPanel distribution body', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockUseGetOperatorCdrs.mockReturnValue({
            data: {
                data: [{
                    id: 'cdr-1',
                    channelId: 'ch-1',
                    filename: '65',
                    duration: 125,
                    createdAt: '2026-07-02T10:00:00.000Z',
                    assistantName: 'Bob',
                    callerId: '+79001234567',
                    analytics: {
                        metrics: {
                            greeting_quality: 70,
                            script_compliance: 80,
                            politeness_empathy: 80,
                            active_listening: 70,
                            objection_handling: 70,
                            product_knowledge: 80,
                            problem_resolution: 70,
                            speech_clarity_pace: 80,
                            closing_quality: 70,
                        },
                    },
                }],
                total: 3,
                page: 1,
                limit: 20,
            },
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: jest.fn(),
        })
    })

    it('renders DistributionPanelBody for a distribution entry', () => {
        render(
            <DrilldownPanel
                entry={{
                    kind: 'distribution',
                    chart: 'sentiment',
                    segment: 'negative',
                    label: 'Негативное настроение',
                }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        expect(screen.getByTestId('distribution-panel-body')).toBeInTheDocument()
    })

    it('requests calls filtered by sentiment with dashboard filters', () => {
        render(
            <DrilldownPanel
                entry={{
                    kind: 'distribution',
                    chart: 'sentiment',
                    segment: 'negative',
                    label: 'Негативное настроение',
                }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        expect(mockUseGetOperatorCdrs).toHaveBeenCalledWith(
            expect.objectContaining({
                sentiment: 'negative',
                startDate: '2026-07-01',
                endDate: '2026-07-31',
                projectId: 'proj-1',
                page: 1,
                limit: 20,
            }),
        )
    })

    it('requests unsuccessful calls when success segment is fail', () => {
        render(
            <DrilldownPanel
                entry={{
                    kind: 'distribution',
                    chart: 'success',
                    segment: 'fail',
                    label: 'Неуспешные звонки',
                }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        expect(mockUseGetOperatorCdrs).toHaveBeenCalledWith(
            expect.objectContaining({ success: false }),
        )
    })

    it('shows labeled call meta and opens call via onOpenCall', async () => {
        const onOpenCall = jest.fn()
        const user = userEvent.setup()

        render(
            <DrilldownPanel
                entry={{
                    kind: 'distribution',
                    chart: 'sentiment',
                    segment: 'negative',
                    label: 'Негативное настроение',
                }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={onOpenCall}
            />,
        )

        expect(screen.getByText('Bob')).toBeInTheDocument()
        expect(screen.getByText('Длительность:')).toBeInTheDocument()
        expect(screen.getByText('Клиент:')).toBeInTheDocument()
        expect(screen.getByText('+79001234567')).toBeInTheDocument()
        expect(screen.getByText('Средний балл:')).toBeInTheDocument()
        expect(screen.queryByText('65')).not.toBeInTheDocument()
        await user.click(screen.getByTestId('distribution-call-row-cdr-1'))
        expect(onOpenCall).toHaveBeenCalledWith('ch-1', 'Негативное настроение')
    })
})

describe('DrilldownPanel stack navigation', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockUseGetOperatorEvidence.mockReturnValue({
            data: evidenceData,
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: jest.fn(),
        })
        mockUseGetOperatorCdrs.mockReturnValue({
            data: {
                data: [{ id: 'call-1', filename: 'call.wav', createdAt: '2026-07-01T10:00:00.000Z' }],
                total: 1,
                page: 1,
                limit: 20,
            },
            isLoading: false,
        })
        mockUseGetOperatorAnalysis.mockReturnValue({
            data: {
                id: 'call-1',
                metrics: { greeting_quality: 70 },
                recordUrl: 'https://example.com/rec/call-1.mp3',
                transcription: 'Operator: Hello',
            },
            isLoading: false,
            isError: false,
            refetch: jest.fn(),
        })
    })

    it('pushes metric selection through onSelectMetric from operator body', async () => {
        const onSelectMetric = jest.fn()
        const user = userEvent.setup()

        render(
            <DrilldownPanel
                entry={{ kind: 'operator', operatorName: 'Alice' }}
                filters={defaultFilters}
                onSelectMetric={onSelectMetric}
                onOpenCall={jest.fn()}
            />,
        )

        await user.click(screen.getByTestId('operator-metric-row-greeting_quality'))
        expect(onSelectMetric).toHaveBeenCalledWith('greeting_quality', 'Greeting')
    })

    it('does not load CDR call list in metric panel (evidence-only)', () => {
        render(
            <DrilldownPanel
                entry={{
                    kind: 'operatorMetric',
                    operatorName: 'Alice',
                    metricId: 'greeting_quality',
                    metricLabel: 'Greeting',
                }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        expect(mockUseGetOperatorCdrs).not.toHaveBeenCalled()
        expect(screen.queryByTestId('operator-metric-call-list')).not.toBeInTheDocument()
    })

    it('labels metric average and sample size in metric panel', () => {
        render(
            <DrilldownPanel
                entry={{
                    kind: 'operatorMetric',
                    operatorName: 'Alice',
                    metricId: 'greeting_quality',
                    metricLabel: 'Greeting',
                }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        expect(screen.getByText('Средний балл метрики')).toBeInTheDocument()
        expect(screen.getByText('Оценок по метрике: {{count}}:2')).toBeInTheDocument()
    })

    it('opens call from evidence quote via onOpenCall', async () => {
        const onOpenCall = jest.fn()
        const user = userEvent.setup()

        render(
            <DrilldownPanel
                entry={{
                    kind: 'operatorMetric',
                    operatorName: 'Alice',
                    metricId: 'greeting_quality',
                    metricLabel: 'Greeting',
                }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={onOpenCall}
            />,
        )

        await user.click(screen.getByTestId('evidence-call-call-1'))
        expect(onOpenCall).toHaveBeenCalledWith('call-1', 'Greeting')
    })

    it('renders ReportShowAnalytics in call body by default', () => {
        render(
            <DrilldownPanel
                entry={{ kind: 'call', channelId: 'call-1', fromLabel: 'Greeting' }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        expect(screen.getByTestId('call-panel-tabs')).toBeInTheDocument()
        expect(screen.getByTestId('report-show-analytics-mock')).toBeInTheDocument()
        expect(screen.queryByTestId('call-panel-recording')).not.toBeInTheDocument()
        expect(screen.queryByTestId('call-panel-dialog')).not.toBeInTheDocument()
        expect(mockUseGetOperatorAnalysis).toHaveBeenCalledWith('call-1', expect.objectContaining({ skip: false }))
    })

    it('shows recording player on recording tab without transcript', async () => {
        const user = userEvent.setup()
        render(
            <DrilldownPanel
                entry={{ kind: 'call', channelId: 'call-1', fromLabel: 'Greeting' }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        await user.click(screen.getByTestId('call-panel-tab-recording'))

        expect(screen.getByTestId('call-panel-recording')).toBeInTheDocument()
        expect(screen.getByText('Прослушать запись')).toBeInTheDocument()
        expect(screen.queryByText('Operator: Hello')).not.toBeInTheDocument()
        expect(screen.queryByTestId('report-show-analytics-mock')).not.toBeInTheDocument()
    })

    it('shows transcript on dialog tab', async () => {
        const user = userEvent.setup()
        render(
            <DrilldownPanel
                entry={{ kind: 'call', channelId: 'call-1', fromLabel: 'Greeting' }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        await user.click(screen.getByTestId('call-panel-tab-dialog'))

        expect(screen.getByTestId('call-panel-dialog')).toBeInTheDocument()
        expect(screen.getByText('Operator: Hello')).toBeInTheDocument()
        expect(screen.queryByText('Прослушать запись')).not.toBeInTheDocument()
    })

    it('uses shared metric labels from API response in operator metric view', () => {
        render(
            <DrilldownPanel
                entry={{
                    kind: 'operatorMetric',
                    operatorName: 'Alice',
                    metricId: 'greeting_quality',
                    metricLabel: 'Greeting',
                }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        expect(screen.getByTestId('operator-metric-panel')).toBeInTheDocument()
        expect(screen.getByText('70')).toBeInTheDocument()
    })
})
