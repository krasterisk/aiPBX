import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { TagStat } from '@/entities/Report'
import { TopicsSection } from './TopicsSection'

const mockNavigate = jest.fn()

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

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
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

    it('renders the mandatory section title and subtitle', () => {
        render(<TopicsSection {...defaultProps} tagStats={sampleStats} />)

        expect(screen.getByText('Темы')).toBeInTheDocument()
        expect(screen.getByText('Нажмите на тему, чтобы увидеть её звонки и статистику')).toBeInTheDocument()
    })

    it('shows the not-configured empty state when the project has no taxonomy', () => {
        render(<TopicsSection {...defaultProps} hasTaxonomy={false} tagStats={undefined} />)

        expect(screen.getByTestId('topics-empty-not-configured')).toBeInTheDocument()
        expect(screen.getByText('Темы звонков не настроены')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Настроить темы проекта' })).toBeInTheDocument()
    })

    it('navigates to project settings from the not-configured action', async () => {
        const user = userEvent.setup()
        render(<TopicsSection {...defaultProps} hasTaxonomy={false} />)

        await user.click(screen.getByRole('button', { name: 'Настроить темы проекта' }))
        expect(mockNavigate).toHaveBeenCalledWith('/analytics/projects')
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
