import { render, screen, fireEvent } from '@testing-library/react'
import { ReportShowAnalytics } from './ReportShowAnalytics'
import type { Analytics } from '../../model/types/report'
import { toast } from 'react-toastify'

// ── Mocks ────────────────────────────────────────────────────────────────────
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'ru', changeLanguage: jest.fn() }
    })
}))

jest.mock('./MetricOverridePanel', () => ({
    MetricOverridePanel: () => null,
}))

const mockUpdateCallTags = jest.fn()
const mockUseGetOperatorAnalysis = jest.fn()
const mockUseGetOperatorProjects = jest.fn()

jest.mock('../../api/reportApi', () => ({
    useUpdateCallTags: () => [mockUpdateCallTags, { isLoading: false }],
    useGetOperatorAnalysis: (...args: unknown[]) => mockUseGetOperatorAnalysis(...args),
    useGetOperatorProjects: (...args: unknown[]) => mockUseGetOperatorProjects(...args),
}))

jest.mock('react-toastify', () => ({
    toast: { error: jest.fn() },
}))

// ── Fixtures ─────────────────────────────────────────────────────────────────

/** Flat operator metrics - from file-upload analytics */
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

/** Analytics with no metrics at all - only summary fallback */
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
    beforeEach(() => {
        mockUpdateCallTags.mockReset()
        mockUpdateCallTags.mockReturnValue({ unwrap: async () => ({ tagIds: [] }) })
        mockUseGetOperatorAnalysis.mockReturnValue({
            data: { projectId: 'project-1' },
        })
        mockUseGetOperatorProjects.mockReturnValue({
            data: [{
                id: 'project-1',
                name: 'Project',
                createdAt: '2026-01-01',
                callTaxonomy: [
                    { id: 'billing', name: 'Счета', aliases: ['счёт'] },
                    { id: 'returns', name: 'Возвраты', aliases: ['возврат'] },
                ],
            }],
        })
    })
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

        it('does not treat internal meta keys (_model/_quality/_assessments) as custom metrics', () => {
            const withMeta: Analytics = {
                ...operatorAnalytics,
                metrics: {
                    ...operatorAnalytics.metrics,
                    _model: { name: 'gpt-x' },
                    _quality: { quality: 'ok' },
                    _assessments: { greeting_quality: { rationale: 'ok' } },
                    _schema_version: 2,
                },
            }
            render(<ReportShowAnalytics analytics={withMeta} />)
            expect(screen.queryByTestId('custom-metrics-card')).not.toBeInTheDocument()
            expect(screen.queryByText('_model')).not.toBeInTheDocument()
            expect(screen.queryByText('_quality')).not.toBeInTheDocument()
            expect(screen.queryByText('_assessments')).not.toBeInTheDocument()
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

        it('renders custom_metrics nested object', () => {
            const nested: Analytics = {
                ...operatorAnalytics,
                metrics: {
                    ...operatorAnalytics.metrics,
                    custom_metrics: {
                        upsell_attempt: true,
                        delivery_time_mentioned: 'Да, 30 минут',
                    },
                },
            }
            render(<ReportShowAnalytics analytics={nested} />)
            expect(screen.getByTestId('custom-metrics-card')).toBeInTheDocument()
            expect(screen.getByText('upsell_attempt')).toBeInTheDocument()
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

    describe('call tag chips', () => {
        const taggedAnalytics: Analytics = {
            ...operatorAnalytics,
            metrics: {
                ...operatorAnalytics.metrics!,
                _topics: {
                    keywords: ['возврат'],
                    tags: ['billing', 'returns'],
                    tag_names: { billing: 'Счета', returns: 'Возвраты' },
                },
            },
        }

        it('renders bounded tag chips on the call card alongside keywords', () => {
            render(<ReportShowAnalytics analytics={taggedAnalytics} channelId="24" />)

            expect(screen.getByTestId('topic-keywords')).toHaveTextContent('возврат')
            expect(screen.getByTestId('call-card-tag-chips-chip-billing')).toBeInTheDocument()
            expect(screen.getByTestId('call-card-tag-chips-chip-returns')).toBeInTheDocument()
        })

        it('hides empty-state copy when a call has no tags', () => {
            render(<ReportShowAnalytics analytics={operatorAnalytics} channelId="24" />)
            expect(screen.queryByText('Темы не найдены')).not.toBeInTheDocument()
            expect(screen.queryByTestId('call-card-tag-chips-empty')).not.toBeInTheDocument()
        })

        it('reveals remove and add controls only after entering edit mode', () => {
            const oneTagAnalytics: Analytics = {
                ...taggedAnalytics,
                metrics: {
                    ...taggedAnalytics.metrics!,
                    _topics: {
                        tags: ['billing'],
                        tag_names: { billing: 'Счета' },
                    },
                },
            }
            render(<ReportShowAnalytics analytics={oneTagAnalytics} channelId="24" />)

            expect(screen.queryByTestId('call-card-tag-chips-remove-billing')).not.toBeInTheDocument()
            fireEvent.click(screen.getByTestId('call-tag-edit-toggle'))
            expect(screen.getByTestId('call-card-tag-chips-remove-billing')).toBeInTheDocument()
            expect(screen.getByTestId('call-card-tag-chips-add')).toBeInTheDocument()
        })

        it('lets user add the first theme when the call has none', () => {
            render(<ReportShowAnalytics analytics={operatorAnalytics} channelId="24" />)

            fireEvent.click(screen.getByTestId('call-tag-edit-toggle'))
            fireEvent.click(screen.getByTestId('call-card-tag-chips-add'))
            fireEvent.click(screen.getByTestId('call-card-tag-chips-picker-option-billing'))

            expect(mockUpdateCallTags).toHaveBeenCalledWith({
                channelId: '24',
                tagIds: ['billing'],
                tagNames: { billing: 'Счета' },
            })
        })

        it('offers only project taxonomy themes not already on the call', () => {
            const oneTagAnalytics: Analytics = {
                ...taggedAnalytics,
                metrics: {
                    ...taggedAnalytics.metrics!,
                    _topics: {
                        tags: ['billing'],
                        tag_names: { billing: 'Счета' },
                    },
                },
            }
            render(<ReportShowAnalytics analytics={oneTagAnalytics} channelId="24" />)

            fireEvent.click(screen.getByTestId('call-tag-edit-toggle'))
            fireEvent.click(screen.getByTestId('call-card-tag-chips-add'))

            expect(screen.queryByTestId('call-card-tag-chips-picker-option-billing')).not.toBeInTheDocument()
            expect(screen.getByTestId('call-card-tag-chips-picker-option-returns')).toBeInTheDocument()
        })

        it('allows free-form themes when project has no taxonomy', () => {
            mockUseGetOperatorProjects.mockReturnValue({
                data: [{
                    id: 'project-1',
                    name: 'Project',
                    createdAt: '2026-01-01',
                    callTaxonomy: [],
                }],
            })

            render(<ReportShowAnalytics analytics={operatorAnalytics} channelId="24" />)
            fireEvent.click(screen.getByTestId('call-tag-edit-toggle'))
            fireEvent.click(screen.getByTestId('call-card-tag-chips-add'))
            fireEvent.change(screen.getByTestId('call-card-tag-chips-custom-input'), {
                target: { value: 'Своя тема' },
            })
            fireEvent.submit(screen.getByTestId('call-card-tag-chips-custom-form'))

            expect(mockUpdateCallTags).toHaveBeenCalledWith({
                channelId: '24',
                tagIds: ['своя-тема'],
                tagNames: { 'своя-тема': 'Своя тема' },
            })
        })

        it('optimistically removes a tag and sends the full resulting set', async () => {
            mockUpdateCallTags.mockReturnValue({
                unwrap: async () => ({ tagIds: ['returns'] }),
            })

            render(<ReportShowAnalytics analytics={taggedAnalytics} channelId="24" />)
            fireEvent.click(screen.getByTestId('call-tag-edit-toggle'))
            fireEvent.click(screen.getByTestId('call-card-tag-chips-remove-billing'))

            expect(screen.queryByTestId('call-card-tag-chips-chip-billing')).not.toBeInTheDocument()
            expect(mockUpdateCallTags).toHaveBeenCalledWith({
                channelId: '24',
                tagIds: ['returns'],
                tagNames: { returns: 'Возвраты' },
            })
        })

        it('restores removed tags and reports failure when save is rejected', async () => {
            mockUpdateCallTags.mockReturnValue({
                unwrap: async () => { throw new Error('network') },
            })

            render(<ReportShowAnalytics analytics={taggedAnalytics} channelId="24" />)
            fireEvent.click(screen.getByTestId('call-tag-edit-toggle'))
            fireEvent.click(screen.getByTestId('call-card-tag-chips-remove-billing'))

            expect(await screen.findByTestId('call-card-tag-chips-chip-billing')).toBeInTheDocument()
            expect(toast.error).toHaveBeenCalledWith('Не удалось сохранить теги. Изменения не применены.')
        })

        it('does not expose tag editing without channelId', () => {
            render(<ReportShowAnalytics analytics={taggedAnalytics} />)
            expect(screen.queryByTestId('call-tag-edit-toggle')).not.toBeInTheDocument()
        })
    })
})
