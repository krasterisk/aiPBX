import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OperatorMetricPanelBody, OperatorPanelBody } from './OperatorPanelBody'
import type { OperatorEvidenceResponse } from '@/entities/Report'

const mockUseGetOperatorEvidence = jest.fn()
const mockUseGetOperatorCdrs = jest.fn()

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, opts?: Record<string, string>) => {
            if (opts?.count) return `${key}:${opts.count}`
            if (opts?.context) return `${key}:${opts.context}`
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
    }
})

const baseEvidence: OperatorEvidenceResponse = {
    operatorName: 'Alice',
    callsCount: 10,
    scoredCalls: 8,
    averageScore: 72.5,
    sampleCapped: false,
    metrics: [
        {
            metricId: 'greeting_quality',
            origin: 'default',
            label: 'Greeting',
            average: 68,
            sampleSize: 8,
            evidenceTotal: 8,
            evidencePage: 1,
            evidencePageSize: 20,
            evidence: [
                {
                    channelId: 'ch-1',
                    createdAt: '2026-07-01T10:00:00.000Z',
                    value: 70,
                    rationale: 'Operator skipped the standard greeting.',
                    quote: 'Hello, how can I help?',
                },
            ],
        },
        {
            metricId: 'closing_quality',
            origin: 'default',
            label: 'Closing',
            average: 80,
            sampleSize: 6,
            evidenceTotal: 6,
            evidencePage: 1,
            evidencePageSize: 20,
            evidence: [
                {
                    channelId: 'ch-2',
                    createdAt: '2026-07-02T10:00:00.000Z',
                    value: 82,
                    rationale: 'Strong closing.',
                    quote: 'Have a nice day.',
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

describe('OperatorPanelBody', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockUseGetOperatorCdrs.mockReturnValue({ data: undefined, isLoading: false })
    })

    it('skips the evidence query when operator name is absent', () => {
        mockUseGetOperatorEvidence.mockReturnValue({
            data: undefined,
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: jest.fn(),
        })

        render(
            <OperatorPanelBody
                entry={{ kind: 'operator', operatorName: '' }}
                filters={defaultFilters}
            />,
        )

        expect(mockUseGetOperatorEvidence).toHaveBeenCalledWith(
            expect.objectContaining({
                startDate: '2026-07-01',
                endDate: '2026-07-31',
                projectId: 'proj-1',
            }),
            expect.objectContaining({ skip: true }),
        )
        expect(mockUseGetOperatorEvidence.mock.calls[0][0]).not.toHaveProperty('operatorName')
    })

    it('lists one row per returned metric with label and average', () => {
        mockUseGetOperatorEvidence.mockReturnValue({
            data: baseEvidence,
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: jest.fn(),
        })

        render(
            <OperatorPanelBody
                entry={{ kind: 'operator', operatorName: 'Alice' }}
                filters={defaultFilters}
            />,
        )

        expect(screen.getByTestId('operator-metric-row-greeting_quality')).toBeInTheDocument()
        expect(screen.getByTestId('operator-metric-row-closing_quality')).toBeInTheDocument()
        expect(screen.getByText('Greeting')).toBeInTheDocument()
        expect(screen.getByText('68')).toBeInTheDocument()
    })

    it('expanding a metric row reveals quotes and rationales', async () => {
        mockUseGetOperatorEvidence.mockReturnValue({
            data: baseEvidence,
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: jest.fn(),
        })

        const user = userEvent.setup()
        render(
            <OperatorPanelBody
                entry={{ kind: 'operator', operatorName: 'Alice' }}
                filters={defaultFilters}
            />,
        )

        expect(screen.queryByTestId('evidence-quote')).not.toBeInTheDocument()

        await user.click(screen.getByTestId('operator-metric-row-greeting_quality'))

        const evidence = screen.getByTestId('operator-metric-evidence-greeting_quality')
        expect(within(evidence).getByTestId('evidence-quote')).toHaveTextContent('Hello, how can I help?')
        expect(within(evidence).getByTestId('evidence-rationale')).toHaveTextContent('Operator skipped the standard greeting.')
    })

    it('renders a single evidence item without requiring expansion setup beyond one metric', async () => {
        mockUseGetOperatorEvidence.mockReturnValue({
            data: {
                ...baseEvidence,
                metrics: [baseEvidence.metrics[0]],
            },
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: jest.fn(),
        })

        const user = userEvent.setup()
        render(
            <OperatorPanelBody
                entry={{ kind: 'operator', operatorName: 'Alice' }}
                filters={defaultFilters}
            />,
        )

        await user.click(screen.getByTestId('operator-metric-row-greeting_quality'))
        expect(screen.getAllByTestId('evidence-quote')).toHaveLength(1)
    })

    it('passes dashboard filters to the evidence query', () => {
        mockUseGetOperatorEvidence.mockReturnValue({
            data: baseEvidence,
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: jest.fn(),
        })

        render(
            <OperatorPanelBody
                entry={{ kind: 'operator', operatorName: 'Alice' }}
                filters={defaultFilters}
            />,
        )

        expect(mockUseGetOperatorEvidence).toHaveBeenCalledWith(
            {
                operatorName: 'Alice',
                startDate: '2026-07-01',
                endDate: '2026-07-31',
                projectId: 'proj-1',
                userId: undefined,
            },
            expect.objectContaining({ skip: false }),
        )
    })

    it('shows skeleton rows while loading', () => {
        mockUseGetOperatorEvidence.mockReturnValue({
            data: undefined,
            isLoading: true,
            isFetching: true,
            isError: false,
            refetch: jest.fn(),
        })

        render(
            <OperatorPanelBody
                entry={{ kind: 'operator', operatorName: 'Alice' }}
                filters={defaultFilters}
            />,
        )

        expect(screen.getByTestId('operator-panel-loading')).toBeInTheDocument()
    })

    it('shows inline error with retry on failure', async () => {
        const refetch = jest.fn()
        mockUseGetOperatorEvidence.mockReturnValue({
            data: undefined,
            isLoading: false,
            isFetching: false,
            isError: true,
            refetch,
        })

        const user = userEvent.setup()
        render(
            <OperatorPanelBody
                entry={{ kind: 'operator', operatorName: 'Alice' }}
                filters={defaultFilters}
            />,
        )

        expect(screen.getByTestId('operator-panel-error')).toBeInTheDocument()
        await user.click(screen.getByText('Повторить'))
        expect(refetch).toHaveBeenCalled()
    })

    it('shows explicit empty state when no metrics returned', () => {
        mockUseGetOperatorEvidence.mockReturnValue({
            data: { ...baseEvidence, metrics: [] },
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: jest.fn(),
        })

        render(
            <OperatorPanelBody
                entry={{ kind: 'operator', operatorName: 'Alice' }}
                filters={defaultFilters}
            />,
        )

        expect(screen.getByTestId('operator-panel-empty')).toBeInTheDocument()
        expect(screen.getByText('Нет обоснований по метрикам')).toBeInTheDocument()
    })

    it('shows capped notice only when sampleCapped is true', () => {
        mockUseGetOperatorEvidence.mockReturnValue({
            data: { ...baseEvidence, sampleCapped: true, scoredCalls: 300 },
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: jest.fn(),
        })

        render(
            <OperatorPanelBody
                entry={{ kind: 'operator', operatorName: 'Alice' }}
                filters={defaultFilters}
            />,
        )

        expect(screen.getByTestId('operator-panel-capped-notice')).toBeInTheDocument()
    })

    it('does not show capped notice when sample is not capped', () => {
        mockUseGetOperatorEvidence.mockReturnValue({
            data: baseEvidence,
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: jest.fn(),
        })

        render(
            <OperatorPanelBody
                entry={{ kind: 'operator', operatorName: 'Alice' }}
                filters={defaultFilters}
            />,
        )

        expect(screen.queryByTestId('operator-panel-capped-notice')).not.toBeInTheDocument()
    })

    it('renders only metrics returned by the backend without placeholder rows', () => {
        mockUseGetOperatorEvidence.mockReturnValue({
            data: {
                ...baseEvidence,
                metrics: [baseEvidence.metrics[0]],
            },
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: jest.fn(),
        })

        render(
            <OperatorPanelBody
                entry={{ kind: 'operator', operatorName: 'Alice' }}
                filters={defaultFilters}
            />,
        )

        expect(screen.getByTestId('operator-metric-row-greeting_quality')).toBeInTheDocument()
        expect(screen.queryByTestId('operator-metric-row-closing_quality')).not.toBeInTheDocument()
        expect(screen.queryByText('нет данных')).not.toBeInTheDocument()
    })
})

describe('OperatorMetricPanelBody', () => {
    const onOpenCall = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
        mockUseGetOperatorEvidence.mockReturnValue({
            data: {
                ...baseEvidence,
                metrics: [{
                    ...baseEvidence.metrics[0],
                    evidenceTotal: 25,
                    evidencePage: 1,
                    evidencePageSize: 20,
                }],
            },
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: jest.fn(),
        })
    })

    it('requests the metric page sorted worst-first', () => {
        render(
            <OperatorMetricPanelBody
                entry={{ kind: 'operatorMetric', operatorName: 'Alice', metricId: 'greeting_quality', metricLabel: 'Greeting' }}
                filters={defaultFilters}
                onOpenCall={onOpenCall}
            />,
        )

        expect(mockUseGetOperatorEvidence).toHaveBeenCalledWith({
            operatorName: 'Alice',
            startDate: '2026-07-01',
            endDate: '2026-07-31',
            projectId: 'proj-1',
            userId: undefined,
            metricId: 'greeting_quality',
            order: 'worst',
            evidencePage: 1,
            evidencePageSize: 20,
        })
        expect(screen.getByText('METRIC_EVIDENCE_LIST_TITLE:25')).toBeInTheDocument()
        expect(screen.getByTestId('operator-metric-pagination')).toBeInTheDocument()
        expect(screen.getByTestId('operator-metric-prev-page')).toBeDisabled()
    })

    it('requests the next page of calls', async () => {
        const user = userEvent.setup()
        render(
            <OperatorMetricPanelBody
                entry={{ kind: 'operatorMetric', metricId: 'greeting_quality', metricLabel: 'Greeting' }}
                filters={defaultFilters}
                onOpenCall={onOpenCall}
            />,
        )

        await user.click(screen.getByTestId('operator-metric-next-page'))

        expect(mockUseGetOperatorEvidence).toHaveBeenLastCalledWith(
            expect.objectContaining({
                metricId: 'greeting_quality',
                evidencePage: 2,
                evidencePageSize: 20,
                order: 'worst',
            }),
        )
    })

    it('hides pagination when every call fits on one page', () => {
        mockUseGetOperatorEvidence.mockReturnValue({
            data: baseEvidence,
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: jest.fn(),
        })

        render(
            <OperatorMetricPanelBody
                entry={{ kind: 'operatorMetric', metricId: 'greeting_quality', metricLabel: 'Greeting' }}
                filters={defaultFilters}
                onOpenCall={onOpenCall}
            />,
        )

        expect(screen.queryByTestId('operator-metric-pagination')).not.toBeInTheDocument()
        expect(screen.getByTestId('evidence-call-ch-1')).toBeInTheDocument()
    })
})
