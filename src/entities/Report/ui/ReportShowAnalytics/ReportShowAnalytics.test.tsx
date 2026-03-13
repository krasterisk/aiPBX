import { render, screen } from '@testing-library/react'
import { ReportShowAnalytics } from './ReportShowAnalytics'
import { Analytics } from '../../model/types/report'

// ── Mocks ────────────────────────────────────────────────────────────────────
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'ru', changeLanguage: jest.fn() }
    })
}))

// ── Fixtures ─────────────────────────────────────────────────────────────────

/** Flat operator metrics — from file-upload analytics */
const operatorAnalytics: Analytics = {
    id: 207,
    channelId: '24',
    metrics: {
        greeting_quality: 70,
        script_compliance: 85,
        politeness_empathy: 80,
        active_listening: 75,
        objection_handling: 60,
        product_knowledge: 90,
        problem_resolution: 95,
        speech_clarity_pace: 80,
        closing_quality: 90,
        customer_sentiment: 'Positive',
        summary: 'Оператор вежливо обработал запрос клиента.',
        success: true,
        csat: 4
    },
    summary: 'Оператор вежливо обработал запрос клиента.',
    sentiment: 'Positive',
    csat: 4,
}

/** Nested bot-call metrics */
const botAnalytics: Analytics = {
    id: 100,
    channelId: '10',
    metrics: {
        business_impact: {
            automation_rate: 0.8,
            escalation_rate: 0.1,
            cost_savings_estimated: 0.5
        },
        scenario_analysis: {
            success: true,
            summary: 'Бот успешно обработал запрос.',
            escalation_reason: null
        },
        user_satisfaction: {
            csat: 5,
            sentiment: 'Positive',
            bail_out_rate: false,
            frustration_detected: false
        },
        accuracy_and_efficiency: {
            average_turns: 4,
            dialog_completion_rate: 0.95,
            entity_extraction_rate: 88,
            context_retention_score: 92
        }
    },
    summary: 'Бот успешно обработал запрос.',
    sentiment: 'Positive',
    csat: 5,
}

/** Analytics with no metrics at all — only summary fallback */
const summaryOnlyAnalytics: Analytics = {
    id: 300,
    channelId: '30',
    summary: 'Только саммари без метрик',
    sentiment: 'Neutral',
    csat: 3,
}

/** Operator metrics WITH custom metrics */
const operatorWithCustomMetrics: Analytics = {
    id: 400,
    channelId: '40',
    metrics: {
        greeting_quality: 70,
        script_compliance: 85,
        politeness_empathy: 80,
        active_listening: 75,
        objection_handling: 60,
        product_knowledge: 90,
        problem_resolution: 95,
        speech_clarity_pace: 80,
        closing_quality: 90,
        customer_sentiment: 'Positive',
        summary: 'Оператор обработал запрос.',
        success: true,
        csat: 4,
        // Custom metrics:
        upsell_attempt: true,
        delivery_time_mentioned: 'Да, 30 минут',
        politeness_score_custom: 92,
    } as any,
    summary: 'Оператор обработал запрос.',
    sentiment: 'Positive',
    csat: 4,
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('ReportShowAnalytics', () => {
    describe('operator analytics (flat metrics)', () => {
        it('renders operator view with data-testid="analytics-operator"', () => {
            render(<ReportShowAnalytics analytics={operatorAnalytics} />)
            expect(screen.getByTestId('analytics-operator')).toBeInTheDocument()
            expect(screen.queryByTestId('analytics-bot')).not.toBeInTheDocument()
        })

        it('renders summary text', () => {
            render(<ReportShowAnalytics analytics={operatorAnalytics} />)
            expect(screen.getByText('Оператор вежливо обработал запрос клиента.')).toBeInTheDocument()
        })

        it('renders progress bars for all numeric metrics', () => {
            render(<ReportShowAnalytics analytics={operatorAnalytics} />)
            const expectedKeys = [
                'greeting_quality', 'script_compliance', 'politeness_empathy',
                'active_listening', 'objection_handling', 'product_knowledge',
                'problem_resolution', 'speech_clarity_pace', 'closing_quality'
            ]
            expectedKeys.forEach(key => {
                expect(screen.getByTestId(`metric-bar-${key}`)).toBeInTheDocument()
            })
        })

        it('renders sentiment badge', () => {
            render(<ReportShowAnalytics analytics={operatorAnalytics} />)
            expect(screen.getByText('Positive')).toBeInTheDocument()
        })

        it('renders success badge', () => {
            render(<ReportShowAnalytics analytics={operatorAnalytics} />)
            expect(screen.getByText('Успех')).toBeInTheDocument()
        })

        it('renders csat value', () => {
            render(<ReportShowAnalytics analytics={operatorAnalytics} />)
            expect(screen.getByText('★ 4')).toBeInTheDocument()
        })

        it('assigns correct width to progress bar fills', () => {
            render(<ReportShowAnalytics analytics={operatorAnalytics} />)
            const greetingBar = screen.getByTestId('metric-bar-greeting_quality')
            expect(greetingBar).toHaveStyle('width: 70%')
        })

        it('does not render custom metrics card when no custom metrics exist', () => {
            render(<ReportShowAnalytics analytics={operatorAnalytics} />)
            expect(screen.queryByTestId('custom-metrics-card')).not.toBeInTheDocument()
        })
    })

    describe('operator analytics with custom metrics', () => {
        it('renders custom metrics card', () => {
            render(<ReportShowAnalytics analytics={operatorWithCustomMetrics} />)
            expect(screen.getByTestId('custom-metrics-card')).toBeInTheDocument()
            expect(screen.getByText('Кастомные метрики')).toBeInTheDocument()
        })

        it('renders boolean custom metric as badge', () => {
            render(<ReportShowAnalytics analytics={operatorWithCustomMetrics} />)
            expect(screen.getByText('upsell_attempt')).toBeInTheDocument()
            // boolean true → "Да"
            expect(screen.getByText('Да')).toBeInTheDocument()
        })

        it('renders number custom metric as progress bar', () => {
            render(<ReportShowAnalytics analytics={operatorWithCustomMetrics} />)
            expect(screen.getByTestId('metric-bar-custom-politeness_score_custom')).toBeInTheDocument()
        })

        it('renders string custom metric as text', () => {
            render(<ReportShowAnalytics analytics={operatorWithCustomMetrics} />)
            expect(screen.getByText('delivery_time_mentioned')).toBeInTheDocument()
            expect(screen.getByText('Да, 30 минут')).toBeInTheDocument()
        })
    })

    describe('bot analytics (nested metrics)', () => {
        it('renders bot view with data-testid="analytics-bot"', () => {
            render(<ReportShowAnalytics analytics={botAnalytics} />)
            expect(screen.getByTestId('analytics-bot')).toBeInTheDocument()
            expect(screen.queryByTestId('analytics-operator')).not.toBeInTheDocument()
        })

        it('renders summary text', () => {
            render(<ReportShowAnalytics analytics={botAnalytics} />)
            expect(screen.getByText('Бот успешно обработал запрос.')).toBeInTheDocument()
        })

        it('renders business impact card', () => {
            render(<ReportShowAnalytics analytics={botAnalytics} />)
            expect(screen.getByText('Влияние на бизнес')).toBeInTheDocument()
            expect(screen.getByText('Уровень автоматизации')).toBeInTheDocument()
        })

        it('renders scenario analysis card', () => {
            render(<ReportShowAnalytics analytics={botAnalytics} />)
            expect(screen.getByText('Анализ сценария')).toBeInTheDocument()
        })

        it('renders user satisfaction card', () => {
            render(<ReportShowAnalytics analytics={botAnalytics} />)
            expect(screen.getByText('Удовлетворенность')).toBeInTheDocument()
        })

        it('renders accuracy and efficiency card', () => {
            render(<ReportShowAnalytics analytics={botAnalytics} />)
            expect(screen.getByText('Точность и эффективность')).toBeInTheDocument()
        })
    })

    describe('summary-only analytics (no metrics)', () => {
        it('renders bot view (fallback) with summary', () => {
            render(<ReportShowAnalytics analytics={summaryOnlyAnalytics} />)
            expect(screen.getByTestId('analytics-bot')).toBeInTheDocument()
            expect(screen.getByText('Только саммари без метрик')).toBeInTheDocument()
        })

        it('does not render any metric cards', () => {
            render(<ReportShowAnalytics analytics={summaryOnlyAnalytics} />)
            expect(screen.queryByText('Влияние на бизнес')).not.toBeInTheDocument()
            expect(screen.queryByText('Анализ сценария')).not.toBeInTheDocument()
            expect(screen.queryByText('Оценка оператора')).not.toBeInTheDocument()
        })
    })
})

