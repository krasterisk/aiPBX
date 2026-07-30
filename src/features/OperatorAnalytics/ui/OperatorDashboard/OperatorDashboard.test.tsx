import { render, screen, within } from '@testing-library/react'
import { OperatorDashboard } from './OperatorDashboard'
import type { OperatorDashboardResponse, OperatorProject } from '@/entities/Report'

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'ru', changeLanguage: jest.fn() },
    }),
}))

const mockUseGetOperatorProjects = jest.fn()
jest.mock('@/entities/Report', () => {
    const actual = jest.requireActual('@/entities/Report')
    return {
        ...actual,
        useGetOperatorProjects: () => mockUseGetOperatorProjects(),
    }
})

jest.mock('./AiInsightsBanner/AiInsightsBanner', () => ({
    AiInsightsBanner: () => <div data-testid="ai-insights-banner-mock" />,
}))

jest.mock('../DashboardBuilder/DashboardConfigGrid', () => ({
    DashboardConfigGrid: () => <div data-testid="oa-section-builder" />,
}))

jest.mock('./OperatorScoreTable/OperatorScoreTable', () => ({
    OperatorScoreTable: () => <div data-testid="operator-score-table-mock" />,
}))

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
