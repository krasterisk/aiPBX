import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OperatorScoreTable } from './OperatorScoreTable'

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

describe('operator counts without usable scores', () => {
    it('shows numeric extensions without an extra numeric avatar badge', async () => {
        const select = jest.fn()
        render(<OperatorScoreTable rows={[
            { operatorName: '221', callsCount: 7, averageScore: 90, successRate: 80, avgCsat: 4, negativeRate: 10 },
        ]} onSelectOperator={select} />)
        const row = screen.getByRole('button', { name: '221', exact: true })
        expect(within(row).queryByText('22')).not.toBeInTheDocument()
        await userEvent.click(row)
        expect(select).toHaveBeenCalledWith('221', expect.any(HTMLElement))
    })

    it('displays missing operators and their full count without inventing quality scores', async () => {
        const select = jest.fn()
        render(<OperatorScoreTable rows={[
            { operatorName: 'Unknown Operator', callsCount: 7, scoredCalls: 0, averageScore: 0, successRate: 0, avgCsat: null, negativeRate: 0 },
            { operatorName: 'Alice', callsCount: 10, averageScore: 90, successRate: 80, avgCsat: 4, negativeRate: 10 },
        ]} onSelectOperator={select} />)
        const row = screen.getByRole('button', { name: 'Без оператора' })
        expect(within(row).getByText('7')).toBeInTheDocument()
        expect(within(row).getAllByText('-')).toHaveLength(4)
        await userEvent.click(row)
        expect(select).toHaveBeenCalledWith('Unknown Operator', expect.any(HTMLElement))
        expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
        expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Alice' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Без оператора' })).toBeInTheDocument()
    })

    it('sorts every operator by header clicks and supports keyboard sorting', async () => {
        render(<OperatorScoreTable rows={[
            { operatorName: 'Alice', callsCount: 3, averageScore: 90, successRate: 80, avgCsat: 4, negativeRate: 10 },
            { operatorName: 'Bob', callsCount: 9, averageScore: 60, successRate: 50, avgCsat: 3, negativeRate: 20 },
        ]} onSelectOperator={jest.fn()} />)
        const order = () => screen.getAllByTestId(/^operator-score-row-/).map(element => element.getAttribute('aria-label'))
        expect(order()).toEqual(['Alice', 'Bob'])
        await userEvent.click(screen.getByRole('columnheader', { name: 'Звонков', exact: true }))
        expect(order()).toEqual(['Bob', 'Alice'])
        expect(screen.getByRole('columnheader', { name: 'Звонков', exact: true })).toHaveAttribute('aria-sort', 'descending')
        await userEvent.click(screen.getByRole('button', { name: 'Звонков', exact: true }))
        expect(order()).toEqual(['Alice', 'Bob'])
        expect(screen.getByRole('columnheader', { name: 'Звонков', exact: true })).toHaveAttribute('aria-sort', 'ascending')
        screen.getByRole('button', { name: 'Оператор', exact: true }).focus()
        await userEvent.keyboard('{Enter}{Enter}')
        expect(order()).toEqual(['Bob', 'Alice'])
        expect(screen.getByRole('columnheader', { name: 'Оператор', exact: true })).toHaveAttribute('aria-sort', 'descending')
    })
})
