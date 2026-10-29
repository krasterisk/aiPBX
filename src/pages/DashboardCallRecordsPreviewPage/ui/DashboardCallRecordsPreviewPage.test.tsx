import { fireEvent, render, screen } from '@testing-library/react'
import DashboardCallRecordsPreviewPage from './DashboardCallRecordsPreviewPage'

const query = jest.fn()
let queryResult: any
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))
jest.mock('react-router-dom', () => ({ useSearchParams: () => [new URLSearchParams('projectId=5'), jest.fn()] }))
jest.mock('react-redux', () => ({ useSelector: (selector: any) => selector() }))
jest.mock('@/entities/User', () => ({ isUserAdmin: () => false, ClientFilter: () => null, getUserAuthData: () => ({ id: '99' }) }))
jest.mock('@/features/Dashboard', () => ({ dashboardPageReducer: () => ({}), getDashboardUserId: () => undefined, getDashboardStartDate: () => '2026-10-24', getDashboardEndDate: () => '2026-10-24' }))
jest.mock('@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader', () => ({ DynamicModuleLoader: ({ children }: any) => children }))
jest.mock('@/widgets/DashboardLayout', () => ({ DashboardLayout: ({ children, periodControl }: any) => <>{periodControl(jest.fn())}{children}</> }))
jest.mock('@/features/Calls', () => ({ CallAnalysisDetail: ({ channelId }: any) => <output data-testid="shared-call-detail">{channelId}</output> }))
jest.mock('@/features/OperatorAnalytics', () => ({ OperatorDashboardPreview: ({ filters, renderCallDetail, loading, error, data }: any) => <><output data-testid="filters">{JSON.stringify(filters)}</output><output data-testid="query-state">{JSON.stringify({ loading, error, data })}</output>{renderCallDetail('native-id', jest.fn())}</> }))
jest.mock('@/entities/Report', () => ({ WITHOUT_PROJECT_FILTER: 'none', useGetCallJournalOptionsQuery: () => ({ currentData: { people: [] } }), useGetOperatorProjects: () => ({ data: [{ id: 5, name: 'Demo' }], isError: false }), useQualityDashboardQuery: (...args: any[]) => { query(...args); return queryResult } }))
jest.mock('./PreviewDatePresets', () => ({ PreviewDatePresets: ({ onChange }: any) => <button onClick={() => onChange({ startDate: '2026-10-23T00:00:00.000Z', endDate: '2026-10-23T23:59:59.999Z' })}>previous</button> }))

beforeEach(() => {
    queryResult = { currentData: {}, isFetching: false, isLoading: false, isError: false }
})

it('keeps exact preview dates local and preserves the original date-only Redux state', () => {
    render(<DashboardCallRecordsPreviewPage />)
    expect(screen.getByTestId('shared-call-detail')).toHaveTextContent('native-id')
    fireEvent.click(screen.getByText('previous'))
    expect(JSON.parse(screen.getByTestId('filters').textContent!)).toEqual({ startDate: '2026-10-23T00:00:00.000Z', endDate: '2026-10-23T23:59:59.999Z', projectId: '5', userId: '99' })
    expect(query).toHaveBeenLastCalledWith(expect.objectContaining({ startDate: '2026-10-23T00:00:00.000Z', userId: '99', projectId: '5' }), expect.objectContaining({ pollingInterval: 60000 }))
})

it('retains the current selection during background refresh and temporary failure', () => {
    const data = { totalAnalyzed: 7 }
    queryResult.currentData = data
    const view = render(<DashboardCallRecordsPreviewPage />)
    queryResult = { ...queryResult, isFetching: true }
    view.rerender(<DashboardCallRecordsPreviewPage />)
    expect(JSON.parse(screen.getByTestId('query-state').textContent!)).toEqual({ data, loading: false, error: false })
    queryResult = { ...queryResult, isFetching: false, isError: true }
    view.rerender(<DashboardCallRecordsPreviewPage />)
    expect(JSON.parse(screen.getByTestId('query-state').textContent!)).toEqual({ data, loading: false, error: false })
})

it('does not display the previous selection while a new selection loads', () => {
    queryResult = { data: { totalAnalyzed: 7 }, currentData: undefined, isFetching: true, isLoading: false, isError: false }
    render(<DashboardCallRecordsPreviewPage />)
    expect(JSON.parse(screen.getByTestId('query-state').textContent!)).toEqual({ loading: true, error: false })
})
