import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OperatorScoreTable } from './OperatorScoreTable'

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

describe('operator counts without usable scores', () => {
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
        await userEvent.type(screen.getByRole('searchbox'), 'без оператора')
        expect(screen.queryByRole('button', { name: 'Alice' })).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Без оператора' })).toBeInTheDocument()
    })
})
