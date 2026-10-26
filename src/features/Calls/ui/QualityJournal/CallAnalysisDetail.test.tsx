import { fireEvent, render, screen } from '@testing-library/react'
import { CallAnalysisDetail } from './CallAnalysisDetail'

const mockQuery = jest.fn()
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))
jest.mock('@/entities/Report', () => ({ useGetQualityDetailQuery: (args: unknown) => mockQuery(args) }))
jest.mock('./JournalDetail', () => ({ JournalDetail: ({ report, onDeleted }: any) => <button onClick={onDeleted}>{report.callerId}</button> }))

it('loads the authorized record by channel and reuses journal detail including deletion callback', () => {
    const onDeleted = jest.fn()
    mockQuery.mockReturnValue({ currentData: { record: { callerId: 'synthetic-phone' } } })
    render(<CallAnalysisDetail channelId="native-id" onDeleted={onDeleted} />)
    expect(mockQuery).toHaveBeenCalledWith({ channelId: 'native-id' })
    fireEvent.click(screen.getByRole('button', { name: 'synthetic-phone' }))
    expect(onDeleted).toHaveBeenCalledTimes(1)
})

it('shows a retry rather than stale data when the channel cannot be loaded', () => {
    const refetch = jest.fn()
    mockQuery.mockReturnValue({ isError: true, refetch })
    render(<CallAnalysisDetail channelId="inaccessible" />)
    expect(screen.getByRole('alert')).toHaveTextContent('qualityLoadError')
    expect(screen.queryByText('synthetic-phone')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'retry' }))
    expect(refetch).toHaveBeenCalledTimes(1)
})
