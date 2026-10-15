import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { OperatorTopicStats } from '@/entities/Report'
import { OperatorTopicMatrix, TopicBreakdown } from './OperatorTopics'

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key })
}))

export const sampleTopicStats: OperatorTopicStats = {
    totalCalls: 4,
    hasMultipleTopics: true,
    topics: [
        { tagId: 'billing', name: 'Оплата', callsCount: 2 },
        { tagId: 'returns', name: 'Возврат', callsCount: 1 },
        { tagId: null, name: '', callsCount: 2 }
    ],
    operators: [
        {
            operatorName: 'Alice',
            callsCount: 2,
            topics: [
                { tagId: 'billing', callsCount: 2 },
                { tagId: 'returns', callsCount: 1 }
            ]
        },
        {
            operatorName: null,
            callsCount: 2,
            topics: [{ tagId: null, callsCount: 2 }]
        }
    ]
}

describe('operator topic matrix', () => {
    it('opens exact cells including both missing dimensions and keeps unique totals', async () => {
        const select = jest.fn()
        render(
            <OperatorTopicMatrix stats={sampleTopicStats} onSelect={select} />
        )
        await userEvent.click(
            screen.getByRole('button', { name: 'Alice / Оплата: 2' })
        )
        expect(select).toHaveBeenLastCalledWith(
            'billing',
            'Alice',
            2,
            expect.any(HTMLElement)
        )
        await userEvent.click(
            screen.getByRole('button', { name: 'Без оператора / Без темы: 2' })
        )
        expect(select).toHaveBeenLastCalledWith(
            null,
            null,
            2,
            expect.any(HTMLElement)
        )
        await userEvent.click(screen.getByRole('button', { name: 'Все операторы / Без темы: 2' }))
        expect(select).toHaveBeenLastCalledWith(null, undefined, 2, expect.any(HTMLElement))
        expect(screen.getByText('Всего звонков: 4')).toBeInTheDocument()
        expect(screen.queryByText('OPERATOR_TOPICS_MULTIPLE_HINT')).not.toBeInTheDocument()
        await userEvent.click(within(screen.getByTestId('operator-topic-matrix')).getByRole('button', { name: 'Подсказка' }))
        expect(await screen.findByRole('tooltip')).toHaveTextContent('OPERATOR_TOPICS_MULTIPLE_HINT')
        expect(
            screen.queryByRole('button', { name: 'Alice / Без темы: 0' })
        ).not.toBeInTheDocument()
    })

    it('filters operators, selects columns and sorts by a topic', async () => {
        render(
            <OperatorTopicMatrix
                stats={sampleTopicStats}
                onSelect={jest.fn()}
            />
        )
        await userEvent.type(screen.getByRole('searchbox'), 'alice')
        expect(
            screen.queryByText('Без оператора')
        ).not.toBeInTheDocument()
        await userEvent.clear(screen.getByRole('searchbox'))
        await userEvent.click(screen.getByText('Выбрать темы'))
        await userEvent.click(screen.getByRole('checkbox', { name: 'Возврат' }))
        expect(
            screen.queryByRole('columnheader', { name: /^Возврат/ })
        ).not.toBeInTheDocument()
        await userEvent.click(screen.getByRole('button', { name: 'Оплата' }))
        expect(
            screen.getByRole('columnheader', { name: /^Оплата/ })
        ).toHaveAttribute('aria-sort', 'descending')
        expect(
            within(screen.getAllByRole('row')[1]).getByText('Alice')
        ).toHaveTextContent('Alice')
    })
})

describe('topic breakdown', () => {
    it('shows operators and their share within a topic and opens the intersection', async () => {
        const select = jest.fn()
        render(
            <TopicBreakdown
                stats={sampleTopicStats}
                tagId="billing"
                onSelect={select}
            />
        )
        expect(screen.getByText('Операторы по теме')).toBeInTheDocument()
        await userEvent.click(
            screen.getByRole('button', { name: 'Alice 2 (100.0%)' })
        )
        expect(select).toHaveBeenCalledWith(
            'billing',
            'Alice',
            2,
            expect.any(HTMLElement)
        )
    })

    it('includes the no-topic bucket for the missing operator', async () => {
        const select = jest.fn()
        render(
            <TopicBreakdown
                stats={sampleTopicStats}
                operatorName="Unknown Operator"
                onSelect={select}
            />
        )
        expect(screen.getByText('Темы оператора')).toBeInTheDocument()
        await userEvent.click(
            screen.getByRole('button', { name: 'Без темы 2 (100.0%)' })
        )
        expect(select).toHaveBeenCalledWith(
            null,
            null,
            2,
            expect.any(HTMLElement)
        )
    })
})
