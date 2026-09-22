import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DonutChart } from './DonutChart'

const data = [
    { id: 'positive', value: 40, label: 'Positive', color: '#22c55e' },
    { id: 'neutral', value: 0, label: 'Neutral', color: '#f59e0b' },
    { id: 'negative', value: 30, label: 'Negative', color: '#ef4444' },
]

describe('DonutChart', () => {
    it('calls onSegmentClick when a non-zero segment path is clicked', async () => {
        const onSegmentClick = jest.fn()
        const user = userEvent.setup()

        render(<DonutChart data={data} onSegmentClick={onSegmentClick} />)

        await user.click(screen.getByTestId('donut-segment-negative'))
        expect(onSegmentClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'negative', value: 30 }))
    })

    it('does not call onSegmentClick for zero-value segments', async () => {
        const onSegmentClick = jest.fn()
        const user = userEvent.setup()

        render(<DonutChart data={data} onSegmentClick={onSegmentClick} />)

        await user.click(screen.getByTestId('donut-segment-neutral'))
        expect(onSegmentClick).not.toHaveBeenCalled()
    })

    it('draws a ring when one segment is 100%', () => {
        render(<DonutChart data={[
            { id: 'success', value: 12, label: 'Успех', color: '#22c55e' },
            { id: 'fail', value: 0, label: 'Нет', color: '#64748b' },
        ]} />)

        const ring = screen.getByTestId('donut-segment-success').getAttribute('d') ?? ''
        expect(ring.match(/A /g)?.length).toBe(4)
    })

    it('calls onSegmentClick from the legend row', async () => {
        const onSegmentClick = jest.fn()
        const user = userEvent.setup()

        render(<DonutChart data={data} onSegmentClick={onSegmentClick} />)

        await user.click(screen.getByTestId('donut-legend-positive'))
        expect(onSegmentClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'positive' }))
    })
})
