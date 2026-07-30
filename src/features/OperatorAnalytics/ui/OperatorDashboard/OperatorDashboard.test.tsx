import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OperatorDashboard } from './OperatorDashboard'
import type { OperatorDashboardResponse, OperatorProject } from '@/entities/Report'

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'ru', changeLanguage: jest.fn() },
    }),
}))

const mockUseGetOperatorProjects = jest.fn()
const mockUseGetOperatorEvidence = jest.fn()
jest.mock('@/entities/Report', () => {
    const actual = jest.requireActual('@/entities/Report')
    return {
        ...actual,
        useGetOperatorProjects: () => mockUseGetOperatorProjects(),
        useGetOperatorEvidence: (...args: unknown[]) => mockUseGetOperatorEvidence(...args),
        useGetOperatorCdrs: () => ({ data: { data: [], total: 0, page: 1, limit: 20 }, isLoading: false }),
        useGetOperatorAnalysis: () => ({ data: undefined, isLoading: false, isError: false, refetch: jest.fn() }),
    }
})

jest.mock('./AiInsightsBanner/AiInsightsBanner', () => ({
    AiInsightsBanner: () => <div data-testid="ai-insights-banner-mock" />,
}))

jest.mock('../DashboardBuilder/DashboardConfigGrid', () => ({
    DashboardConfigGrid: () => <div data-testid="oa-section-builder" />,
}))

jest.mock('@/shared/ui/redesign-v3', () => {
    const actual = jest.requireActual('@/shared/ui/redesign-v3')
    return {
        ...actual,
        SidePanel: ({
            isOpen,
            title,
            onClose,
            onBack,
            backLabel,
            children,
        }: {
            isOpen: boolean
            title: string
            onClose: () => void
            onBack?: () => void
            backLabel?: string
            children: React.ReactNode
        }) => (isOpen ? (
            <div data-testid="operator-drilldown-panel">
                <h2>{title}</h2>
                {onBack && (
                    <button type="button" aria-label={backLabel ?? 'Назад'} onClick={onBack}>
                        back
                    </button>
                )}
                <button type="button" aria-label="Закрыть панель" onClick={onClose}>
                    close
                </button>
                {children}
            </div>
        ) : null),
    }
})

jest.mock('@/shared/ui/redesigned/DonutChart', () => ({
    DonutChart: () => <div data-testid="donut-chart-mock" />,
}))

const baseDashboardData: OperatorDashboardResponse = {
    totalAnalyzed: 120,
    totalCost: 5000,
    totalAmountCurrency: 5000,
    averageDuration: 180,
    averageScore: 78,
    successRate: 0.65,
    aggregatedMetrics: {
        greeting_quality: 80,
        script_compliance: 75,
        politeness_empathy: 82,
        active_listening: 70,
        objection_handling: 68,
        product_knowledge: 85,
        problem_resolution: 77,
        speech_clarity_pace: 79,
        closing_quality: 81,
    },
    sentimentDistribution: { positive: 40, neutral: 50, negative: 30 },
    timeSeries: {
        monthly: [{ label: 'Jan', callsCount: 10, avgScore: 75, avgDuration: 120 }],
        daily: [{ label: '2026-01-01', callsCount: 5, avgScore: 76, avgDuration: 130 }],
    },
    insightsAvailable: true,
    agentScorecards: [
        {
            operatorName: 'Alice',
            callsCount: 20,
            averageScore: 82,
            successRate: 0.7,
            avgCsat: 4.2,
            negativeRate: 0.1,
        },
    ],
}

const baseProjects: OperatorProject[] = [
    {
        id: 'proj-1' as unknown as string,
        name: 'Sales',
        createdAt: '2026-01-01T00:00:00.000Z',
    },
]

const projectWithBuilderLayout: OperatorProject = {
    id: 'proj-builder' as unknown as string,
    name: 'Builder Project',
    createdAt: '2026-01-01T00:00:00.000Z',
    dashboardConfig: {
        widgets: [{
            id: 'w1',
            title: 'Activity',
            source: 'default',
            metricId: 'calls',
            widgetType: 'heatmap',
            size: 'md',
            position: 0,
        }],
        maxWidgets: 12,
    },
}

const defaultProps = {
    data: baseDashboardData,
    isLoading: false,
    projectId: '',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    onChangeProjectId: jest.fn(),
}

function sectionOrder(container: HTMLElement, testIds: string[]): number[] {
    const root = container.firstElementChild as HTMLElement | null
    if (!root) return testIds.map(() => -1)
    return testIds.map(id => {
        const el = within(root).queryByTestId(id)
        if (!el) return -1
        const nodes = Array.from(root.querySelectorAll('[data-testid]'))
        return nodes.indexOf(el)
    })
}

describe('OperatorDashboard layout', () => {
    beforeEach(() => {
        mockUseGetOperatorProjects.mockReturnValue({ data: baseProjects })
    })

    it('renders stats, insights and ranking sections in document order', () => {
        const { container } = render(<OperatorDashboard {...defaultProps} />)

        expect(screen.getByTestId('oa-section-stats')).toBeInTheDocument()
        expect(screen.getByTestId('oa-section-insights')).toBeInTheDocument()
        expect(screen.getByTestId('oa-section-mid-charts')).toBeInTheDocument()
        expect(screen.getByTestId('oa-section-ranking')).toBeInTheDocument()

        const [statsIdx, insightsIdx, midIdx, rankingIdx] = sectionOrder(container, [
            'oa-section-stats',
            'oa-section-insights',
            'oa-section-mid-charts',
            'oa-section-ranking',
        ])

        expect(statsIdx).toBeGreaterThanOrEqual(0)
        expect(insightsIdx).toBeGreaterThan(statsIdx)
        expect(midIdx).toBeGreaterThan(insightsIdx)
        expect(rankingIdx).toBeGreaterThan(midIdx)
    })

    it('keeps both cost stat cards', () => {
        render(<OperatorDashboard {...defaultProps} />)
        expect(screen.getByText('Общая стоимость')).toBeInTheDocument()
        expect(screen.getByText('Средняя стоимость')).toBeInTheDocument()
    })

    it('does not render removed usage, dynamics or activity sections', () => {
        render(<OperatorDashboard {...defaultProps} />)
        expect(screen.queryByTestId('oa-section-usage')).not.toBeInTheDocument()
        expect(screen.queryByTestId('oa-section-call-dynamics')).not.toBeInTheDocument()
        expect(screen.queryByTestId('oa-section-activity')).not.toBeInTheDocument()
        expect(screen.queryByText('Динамика звонков')).not.toBeInTheDocument()
    })

    it('shows builder grid instead of mid-charts when custom layout is configured', () => {
        mockUseGetOperatorProjects.mockReturnValue({
            data: [projectWithBuilderLayout],
        })

        render(
            <OperatorDashboard
                {...defaultProps}
                projectId="proj-builder"
            />,
        )

        expect(screen.getByTestId('oa-section-builder')).toBeInTheDocument()
        expect(screen.queryByTestId('oa-section-mid-charts')).not.toBeInTheDocument()
        expect(screen.getByTestId('oa-section-ranking')).toBeInTheDocument()
    })

    it('shows loading placeholders without section test ids', () => {
        render(<OperatorDashboard {...defaultProps} data={undefined} isLoading />)
        expect(screen.queryByTestId('oa-section-stats')).not.toBeInTheDocument()
        expect(screen.queryByTestId('oa-section-insights')).not.toBeInTheDocument()
        expect(screen.queryByTestId('oa-section-mid-charts')).not.toBeInTheDocument()
        expect(screen.queryByTestId('oa-section-ranking')).not.toBeInTheDocument()
    })

    it('keeps all four onboarding tour anchors', () => {
        render(<OperatorDashboard {...defaultProps} />)
        expect(document.querySelector('[data-tour-id="oa-stats"]')).toBeInTheDocument()
        expect(document.querySelector('[data-tour-id="oa-insights"]')).toBeInTheDocument()
        expect(document.querySelector('[data-tour-id="oa-scorecard"]')).toBeInTheDocument()
        expect(document.querySelector('[data-tour-id="oa-upload-entry"]')).toBeInTheDocument()
    })
})

describe('OperatorDashboard project id resolution', () => {
    const numericIdProjects = [
        {
            id: 42,
            name: 'Numeric Project',
            createdAt: '2026-01-01T00:00:00.000Z',
        },
    ] as unknown as OperatorProject[]

    beforeEach(() => {
        mockUseGetOperatorProjects.mockReturnValue({ data: numericIdProjects })
    })

    it('resolves active project when projectId is a string and list ids are numbers', () => {
        render(
            <OperatorDashboard
                {...defaultProps}
                projectId="42"
            />,
        )

        expect(screen.getByText('Numeric Project')).toBeInTheDocument()
        expect(screen.getByTestId('oa-section-mid-charts')).toBeInTheDocument()
    })

    it('marks matching project chip as active when ids differ by type', () => {
        render(
            <OperatorDashboard
                {...defaultProps}
                projectId="42"
            />,
        )

        const chip = screen.getByText('Numeric Project').closest('[class*="projectChip"]')
        expect(chip?.className).toMatch(/light/)
    })

    it('marks all-projects chip active when no project id is set', () => {
        render(<OperatorDashboard {...defaultProps} projectId="" />)

        const allProjectsChip = screen.getByText('Все проекты').closest('[class*="projectChip"]')
        expect(allProjectsChip?.className).toMatch(/light/)
    })

    it('renders without error when project id matches no project', () => {
        render(
            <OperatorDashboard
                {...defaultProps}
                projectId="999"
            />,
        )

        expect(screen.getByTestId('oa-section-stats')).toBeInTheDocument()
        const allProjectsChip = screen.getByText('Все проекты').closest('[class*="projectChip"]')
        expect(allProjectsChip?.className).not.toMatch(/light/)
    })
})

describe('OperatorDashboard drill-down panel', () => {
    beforeEach(() => {
        mockUseGetOperatorProjects.mockReturnValue({ data: baseProjects })
        mockUseGetOperatorEvidence.mockReturnValue({
            data: {
                operatorName: 'Alice',
                callsCount: 1,
                scoredCalls: 1,
                averageScore: 82,
                sampleCapped: false,
                metrics: [],
            },
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: jest.fn(),
        })
    })

    it('opens the panel with the operator name when a row is clicked', async () => {
        const user = userEvent.setup()
        render(<OperatorDashboard {...defaultProps} />)

        expect(screen.queryByTestId('operator-drilldown-panel')).not.toBeInTheDocument()
        await user.click(screen.getByTestId('operator-score-row-Alice'))
        expect(screen.getByTestId('operator-drilldown-panel')).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Alice' })).toBeInTheDocument()
    })

    it('opens the panel when Enter is pressed on a focused operator row', async () => {
        const user = userEvent.setup()
        render(<OperatorDashboard {...defaultProps} />)

        const row = screen.getByTestId('operator-score-row-Alice')
        row.focus()
        await user.keyboard('{Enter}')
        expect(screen.getByRole('heading', { name: 'Alice' })).toBeInTheDocument()
    })

    it('opens the panel when Space is pressed on a focused operator row', async () => {
        const user = userEvent.setup()
        render(<OperatorDashboard {...defaultProps} />)

        const row = screen.getByTestId('operator-score-row-Alice')
        row.focus()
        await user.keyboard(' ')
        expect(screen.getByRole('heading', { name: 'Alice' })).toBeInTheDocument()
    })

    it('exposes operator rows as keyboard-reachable buttons with accessible names', () => {
        render(<OperatorDashboard {...defaultProps} />)
        expect(screen.getByRole('button', { name: 'Alice' })).toHaveAttribute('tabindex', '0')
    })

    it('returns focus to the triggering row when the panel closes', async () => {
        const user = userEvent.setup()
        render(<OperatorDashboard {...defaultProps} />)

        const row = screen.getByTestId('operator-score-row-Alice')
        await user.click(row)
        await user.click(screen.getByRole('button', { name: 'Закрыть панель' }))
        expect(row).toHaveFocus()
    })

    it('clears the stack on close so reopening has no back control', async () => {
        const user = userEvent.setup()
        render(<OperatorDashboard {...defaultProps} />)

        await user.click(screen.getByTestId('operator-score-row-Alice'))
        await user.click(screen.getByRole('button', { name: 'Закрыть панель' }))
        await user.click(screen.getByTestId('operator-score-row-Alice'))

        expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument()
    })

    it('mounts exactly one panel element', async () => {
        const user = userEvent.setup()
        render(<OperatorDashboard {...defaultProps} />)

        await user.click(screen.getByTestId('operator-score-row-Alice'))
        expect(screen.getAllByTestId('operator-drilldown-panel')).toHaveLength(1)
    })

    it('renders the panel in builder layout mode as well', async () => {
        mockUseGetOperatorProjects.mockReturnValue({ data: [projectWithBuilderLayout] })
        const user = userEvent.setup()

        render(
            <OperatorDashboard
                {...defaultProps}
                projectId="proj-builder"
            />,
        )

        await user.click(screen.getByTestId('operator-score-row-Alice'))
        expect(screen.getByTestId('operator-drilldown-panel')).toBeInTheDocument()
    })
})
