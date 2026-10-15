import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { OperatorTopicStats } from '@/entities/Report'
import { TopicCharts } from './TopicCharts'

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

const stats: OperatorTopicStats = {
    totalCalls: 4,
    hasMultipleTopics: true,
    topics: [
        { tagId: 'a', name: 'Продажи', callsCount: 2 },
        { tagId: 'b', name: 'Поддержка', callsCount: 1 },
        { tagId: null, name: '', callsCount: 2 },
    ],
    operators: [],
}

describe('topic charts', () => {
    it('uses unique calls for coverage, even when topic counts overlap', () => {
        render(<TopicCharts stats={stats} onSelect={jest.fn()} />)
        expect(screen.getByText('TOPIC_CLASSIFIED: 2')).toBeInTheDocument()
        expect(screen.getByText('Без темы: 2')).toBeInTheDocument()
        expect(within(screen.getByTestId('topic-coverage')).getByText('50.0%')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Поддержка: 1 (25.0%)' })).toBeInTheDocument()
        expect(screen.getByTestId('donut-segment-classified')).toBeInTheDocument()
        expect(screen.getByTestId('donut-segment-unclassified')).toBeInTheDocument()
    })

    it('opens topic bars with exact counts and supports keyboard activation for no topic', async () => {
        const select = jest.fn()
        render(<TopicCharts stats={stats} onSelect={select} />)
        await userEvent.click(screen.getByRole('button', { name: 'Продажи: 2 (50.0%)' }))
        expect(select).toHaveBeenLastCalledWith('a', undefined, 2, expect.any(HTMLElement))
        screen.getByRole('button', { name: 'Без темы: 2 (50.0%)' }).focus()
        await userEvent.keyboard('{Enter}')
        expect(select).toHaveBeenLastCalledWith(null, undefined, 2, expect.any(HTMLElement))
    })

    it('shows full unclassified coverage and renders nothing for an empty period', () => {
        const { rerender } = render(<TopicCharts stats={{ ...stats, topics: [{ tagId: null, name: '', callsCount: 4 }] }} />)
        expect(screen.getByText('0.0%')).toBeInTheDocument()
        expect(screen.getByText('TOPIC_CLASSIFIED: 0')).toBeInTheDocument()
        expect(screen.getByTestId('donut-segment-unclassified')).toBeInTheDocument()
        expect(screen.queryByTestId('donut-segment-classified')).not.toBeInTheDocument()
        rerender(<TopicCharts stats={{ ...stats, totalCalls: 0 }} />)
        expect(screen.queryByTestId('topic-charts')).not.toBeInTheDocument()
    })

    it('retains the no-topic bucket when many topics are collapsed', async () => {
        render(<TopicCharts stats={{
            ...stats,
            totalCalls: 100,
            topics: [...Array.from({ length: 12 }, (_, index) => ({ tagId: `t-${index}`, name: `Topic ${index}`, callsCount: 10 })), { tagId: null, name: '', callsCount: 1 }],
        }} onSelect={jest.fn()} />)
        expect(screen.getByRole('button', { name: 'Без темы: 1 (1.0%)' })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Topic 11: 10 (10.0%)' })).not.toBeInTheDocument()
        await userEvent.click(screen.getByRole('button', { name: 'Показать все ({{count}})' }))
        expect(screen.getByRole('button', { name: 'Topic 11: 10 (10.0%)' })).toBeInTheDocument()
    })
})
