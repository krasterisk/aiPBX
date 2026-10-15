import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { TagStat } from '@/entities/Report'
import { TopicsSection } from './TopicsSection'

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, opts?: Record<string, string | number>) => {
            if (opts?.count != null) return `${key}:${opts.count}`
            if (opts?.value != null) return `${key}:${opts.value}`
            return key
        },
        i18n: { language: 'ru', changeLanguage: jest.fn() },
    }),
}))

const sampleStats: TagStat[] = [
    {
        tagId: 'tag-1',
        name: 'Продажи',
        callsCount: 42,
        averageScore: 78.5,
        successRate: 0.65,
        sentiment: { positive: 20, neutral: 15, negative: 7 },
    },
    {
        tagId: 'tag-2',
        name: 'Поддержка',
        callsCount: 18,
        averageScore: 82,
        successRate: 0.7,
        sentiment: { positive: 10, neutral: 5, negative: 3 },
    },
]

const defaultProps = {
    hasTaxonomy: true,
    onSelectTag: jest.fn(),
}

describe('TopicsSection', () => {
    const matrixStats = {
        totalCalls: 3,
        hasMultipleTopics: false,
        topics: [{ tagId: 'tag-1', name: 'Продажи', callsCount: 1 }, { tagId: null, name: '', callsCount: 2 }],
        operators: [
            { operatorName: 'Alice', callsCount: 2, topics: [{ tagId: 'tag-1', callsCount: 1 }, { tagId: null, callsCount: 1 }] },
            { operatorName: null, callsCount: 1, topics: [{ tagId: null, callsCount: 1 }] },
        ],
    }

    it('groups the topic views into accessible tabs without an operator-rating tab', async () => {
        render(<TopicsSection {...defaultProps} tagStats={sampleStats} topicStats={matrixStats} onSelectTopicCalls={jest.fn()} />)
        expect(screen.getAllByRole('tab')).toHaveLength(2)
        expect(screen.queryByRole('tab', { name: 'Рейтинг операторов' })).not.toBeInTheDocument()
        const overview = screen.getByRole('tab', { name: 'Темы', exact: true })
        overview.focus()
        await userEvent.keyboard('{ArrowRight}{Enter}')
        expect(screen.getByRole('tab', { name: 'Операторы по темам', exact: true })).toHaveAttribute('aria-selected', 'true')
        expect(screen.getByTestId('operator-topic-matrix')).toBeInTheDocument()
        expect(screen.queryByTestId('topics-card-grid')).not.toBeInTheDocument()
        await userEvent.click(overview)
        expect(screen.getByTestId('topics-card-grid')).toBeInTheDocument()
    })

    it('uses one matrix for missing dimensions and routes operator names to their panels', async () => {
        const select = jest.fn()
        const selectOperator = jest.fn()
        render(<TopicsSection {...defaultProps} tagStats={sampleStats} topicStats={matrixStats} onSelectTopicCalls={select} onSelectOperator={selectOperator} />)
        expect(screen.queryByRole('tab', { name: 'Операторы по теме', exact: true })).not.toBeInTheDocument()
        expect(screen.queryByRole('tab', { name: 'Темы оператора', exact: true })).not.toBeInTheDocument()
        await userEvent.click(screen.getByRole('tab', { name: 'Операторы по темам', exact: true }))
        await userEvent.click(screen.getByRole('button', { name: 'Без оператора / Без темы: 1' }))
        expect(select).toHaveBeenLastCalledWith(null, null, 1, expect.any(HTMLElement))
        await userEvent.click(screen.getByRole('button', { name: 'Без оператора', exact: true }))
        expect(selectOperator).toHaveBeenLastCalledWith('Unknown Operator', expect.any(HTMLElement))
        await userEvent.click(screen.getByRole('button', { name: 'Alice', exact: true }))
        expect(selectOperator).toHaveBeenLastCalledWith('Alice', expect.any(HTMLElement))
    })
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders one card per theme with name, call count and average score', () => {
        render(<TopicsSection {...defaultProps} tagStats={sampleStats} />)

        expect(screen.getByTestId('topic-card-tag-1')).toBeInTheDocument()
        expect(screen.getByText('Продажи')).toBeInTheDocument()
        expect(screen.getByText('42')).toBeInTheDocument()
        expect(screen.getByText('Средний балл: 78.5')).toBeInTheDocument()
    })

    it('reports theme selection when the whole card is clicked', async () => {
        const onSelectTag = jest.fn()
        const user = userEvent.setup()

        render(<TopicsSection {...defaultProps} tagStats={sampleStats} onSelectTag={onSelectTag} />)
        await user.click(screen.getByTestId('topic-card-tag-1'))

        expect(onSelectTag).toHaveBeenCalledWith(sampleStats[0], expect.any(HTMLButtonElement))
    })

    it('activates cards on Enter and Space with accessible names', async () => {
        const onSelectTag = jest.fn()
        const user = userEvent.setup()

        render(<TopicsSection {...defaultProps} tagStats={sampleStats} onSelectTag={onSelectTag} />)

        const card = screen.getByRole('button', { name: 'Продажи' })

        card.focus()
        await user.keyboard('{Enter}')
        expect(onSelectTag).toHaveBeenCalledWith(sampleStats[0], card)

        onSelectTag.mockClear()
        card.focus()
        await user.keyboard(' ')
        expect(onSelectTag).toHaveBeenCalledWith(sampleStats[0], card)
    })

    it('shows the section title and keeps long guidance in a tooltip', async () => {
        render(<TopicsSection {...defaultProps} tagStats={sampleStats} />)

        expect(screen.getByRole('heading', { name: 'Темы звонков' })).toBeInTheDocument()
        expect(screen.getByRole('tab', { name: 'Темы' })).toBeInTheDocument()
        expect(screen.queryByText('Нажмите на тему, чтобы увидеть её звонки и статистику')).not.toBeInTheDocument()
        await userEvent.click(screen.getByRole('button', { name: 'Подсказка' }))
        expect(await screen.findByRole('tooltip')).toHaveTextContent('Нажмите на тему, чтобы увидеть её звонки и статистику')
    })

    it('does not render the section when the project has no taxonomy', () => {
        const { container } = render(
            <TopicsSection {...defaultProps} hasTaxonomy={false} tagStats={undefined} />,
        )

        expect(container).toBeEmptyDOMElement()
        expect(screen.queryByTestId('oa-section-topics')).not.toBeInTheDocument()
    })

    it('shows the zero-matches empty state when taxonomy exists but statistics are empty', () => {
        render(<TopicsSection {...defaultProps} hasTaxonomy tagStats={[]} />)

        expect(screen.getByTestId('topics-empty-zero-matches')).toBeInTheDocument()
        expect(screen.getByText('Совпадений по темам нет')).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Настроить темы проекта' })).not.toBeInTheDocument()
    })

    it('does not treat an empty statistics list alone as not-configured', () => {
        render(<TopicsSection {...defaultProps} hasTaxonomy tagStats={[]} />)

        expect(screen.queryByTestId('topics-empty-not-configured')).not.toBeInTheDocument()
    })

    it('renders skeleton cards while loading', () => {
        render(<TopicsSection {...defaultProps} isLoading tagStats={sampleStats} />)

        expect(screen.getByTestId('topics-section-loading')).toBeInTheDocument()
        expect(screen.queryByTestId('topic-card-tag-1')).not.toBeInTheDocument()
    })

    it('shows expand control only above the display threshold and reveals in place', async () => {
        const manyStats: TagStat[] = Array.from({ length: 10 }, (_, i) => ({
            tagId: `tag-${i}`,
            name: `Theme ${i}`,
            callsCount: 100 - i,
            averageScore: 70,
            successRate: 0.5,
            sentiment: { positive: 1, neutral: 1, negative: 1 },
        }))
        const user = userEvent.setup()

        render(<TopicsSection {...defaultProps} tagStats={manyStats} />)

        const grid = screen.getByTestId('topics-card-grid')
        expect(within(grid).getAllByRole('button')).toHaveLength(8)
        expect(screen.getByTestId('topics-expand-control')).toBeInTheDocument()

        await user.click(screen.getByTestId('topics-expand-control'))
        expect(within(grid).getAllByRole('button')).toHaveLength(10)
        expect(screen.queryByTestId('topics-expand-control')).not.toBeInTheDocument()
    })

    it('does not render expand control at or below the threshold', () => {
        render(<TopicsSection {...defaultProps} tagStats={sampleStats} />)
        expect(screen.queryByTestId('topics-expand-control')).not.toBeInTheDocument()
    })
})
