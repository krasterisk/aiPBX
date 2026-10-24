import { fireEvent, render, screen } from '@testing-library/react'
import DashboardCallRecordsPreviewPage from './DashboardCallRecordsPreviewPage'

const query = jest.fn()
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))
jest.mock('react-router-dom', () => ({ useSearchParams: () => [new URLSearchParams('projectId=5'), jest.fn()] }))
jest.mock('react-redux', () => ({ useSelector: (selector: any) => selector() }))
jest.mock('@/entities/User', () => ({ isUserAdmin: () => false, getUserAuthData: () => ({ id: '99' }) }))
jest.mock('@/features/Dashboard', () => ({ dashboardPageReducer: () => ({}), getDashboardUserId: () => undefined, getDashboardStartDate: () => '2026-10-24', getDashboardEndDate: () => '2026-10-24' }))
jest.mock('@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader', () => ({ DynamicModuleLoader: ({ children }: any) => children }))
jest.mock('@/widgets/DashboardLayout', () => ({ DashboardLayout: ({ children, periodControl }: any) => <>{periodControl(jest.fn())}{children}</> }))
jest.mock('@/features/OperatorAnalytics', () => ({ OperatorDashboardPreview: ({ filters }: any) => <output data-testid="filters">{JSON.stringify(filters)}</output> }))
jest.mock('@/entities/Report', () => ({ WITHOUT_PROJECT_FILTER: 'none', useGetOperatorProjects: () => ({ data: [{ id: 5, name: 'Demo' }] }), useGetOperatorDashboard: (...args: any[]) => { query(...args); return { data: {}, isFetching: false } } }))
jest.mock('./PreviewDatePresets', () => ({ PreviewDatePresets: ({ onChange }: any) => <button onClick={() => onChange({ startDate: '2026-10-23T00:00:00.000Z', endDate: '2026-10-23T23:59:59.999Z' })}>previous</button> }))

it('keeps exact preview dates local and preserves the original date-only Redux state', () => {
    render(<DashboardCallRecordsPreviewPage />)
    fireEvent.click(screen.getByText('previous'))
    expect(JSON.parse(screen.getByTestId('filters').textContent!)).toEqual({ startDate: '2026-10-23T00:00:00.000Z', endDate: '2026-10-23T23:59:59.999Z', projectId: '5', userId: '99' })
    expect(query).toHaveBeenLastCalledWith(expect.objectContaining({ startDate: '2026-10-23T00:00:00.000Z', userId: '99', projectId: '5' }), expect.anything())
})
