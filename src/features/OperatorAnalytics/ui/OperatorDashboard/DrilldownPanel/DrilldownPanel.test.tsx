import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DrilldownPanel } from './DrilldownPanel'
import type { OperatorEvidenceResponse } from '@/entities/Report'

const mockUseGetOperatorEvidence = jest.fn()
const mockUseGetOperatorCdrs = jest.fn()
const mockUseGetOperatorAnalysis = jest.fn()

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, opts?: Record<string, string>) => {
            if (opts?.count) return `${key}:${opts.count}`
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

    it('uses operatorNameExact for metric call list query', () => {
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

        expect(mockUseGetOperatorCdrs).toHaveBeenCalledWith(
            expect.objectContaining({
                operatorNameExact: 'Alice',
                startDate: '2026-07-01',
                endDate: '2026-07-31',
                projectId: 'proj-1',
            }),
            expect.any(Object),
        )
        expect(mockUseGetOperatorCdrs.mock.calls[0][0]).not.toHaveProperty('search')
    })

    it('shows explicit empty state when call list is empty', () => {
        mockUseGetOperatorCdrs.mockReturnValue({
            data: { data: [], total: 0, page: 1, limit: 20 },
            isLoading: false,
        })

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

        expect(screen.getByTestId('operator-metric-calls-empty')).toBeInTheDocument()
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

    it('opens call from call list row via onOpenCall', async () => {
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

        await user.click(screen.getByTestId('call-list-row-call-1'))
        expect(onOpenCall).toHaveBeenCalledWith('call-1', 'Greeting')
    })

    it('renders ReportShowAnalytics in call body', () => {
        render(
            <DrilldownPanel
                entry={{ kind: 'call', channelId: 'call-1', fromLabel: 'Greeting' }}
                filters={defaultFilters}
                onSelectMetric={jest.fn()}
                onOpenCall={jest.fn()}
            />,
        )

        expect(screen.getByTestId('report-show-analytics-mock')).toBeInTheDocument()
        expect(mockUseGetOperatorAnalysis).toHaveBeenCalledWith('call-1', expect.objectContaining({ skip: false }))
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
