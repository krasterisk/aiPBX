import { fireEvent, render, screen } from '@testing-library/react'
import { PreviewCalls } from './PreviewCalls'

const cdrs = jest.fn()
jest.mock('@/entities/Report', () => ({ useGetOperatorCdrs: (...args: any[]) => cdrs(...args) }))
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

it('renders native CDR nested metrics and opens the analysis channel rather than the row ID', () => {
    cdrs.mockReturnValue({ currentData: { data: [{ id: 'cdr-1', channelId: 'analysis-7', createdAt: '2026-10-24T06:00:00Z', assistantName: 'Demo operator', callerId: '+7 900 000-00-00', duration: 72, analytics: { metrics: { greeting_quality: 80 } } }], total: 1 }, isFetching: false, isError: false })
    const onOpen = jest.fn()
    render(<PreviewCalls query={{ userId: '99', projectId: '5' }} page={1} search="" onPage={jest.fn()} onSearch={jest.fn()} onOpen={onOpen} />)
    expect(screen.getByText('80')).toBeInTheDocument()
    expect(screen.getByText('Demo operator')).toBeInTheDocument()
    expect(screen.getByText('+7 900 000-00-00')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'openCall' }))
    expect(onOpen).toHaveBeenCalledWith('analysis-7')
    expect(cdrs).toHaveBeenCalledWith(expect.objectContaining({ userId: '99', projectId: '5', limit: 10, sortField: 'createdAt' }))
})
