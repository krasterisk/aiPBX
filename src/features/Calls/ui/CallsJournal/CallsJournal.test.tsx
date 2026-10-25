import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { CallsJournal } from './CallsJournal'

const journal = jest.fn()
const options = jest.fn()
const fetchPage = jest.fn()
const save = jest.fn()
let admin = false
const person1 = JSON.stringify({ userId: '99', operatorId: '218' })
const person2 = JSON.stringify({ userId: '99', assistantId: '7' })
const row: any = { id: 'one', channelId: 'channel-one', callerId: '+70000000001', userId: '99', assistantName: 'One', projectId: 5, source: 'external-api', duration: 65, createdAt: '2026-10-25T07:00:00Z', analytics: { channelId: 'channel-one', metrics: { greeting_quality: 90, _topics: { tags: ['service'], tag_names: { service: 'Service' } } } } }
const data = { rows: [row], count: 40, totalCost: 0 }
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }) }))
jest.mock('react-redux', () => ({ useSelector: (fn: any) => fn() }))
jest.mock('react-router-dom', () => ({ Link: ({ children }: any) => <span>{children}</span> }))
jest.mock('@/entities/User', () => ({ getUserAuthData: () => ({ id: '1', vpbx_user_id: '99' }), isUserAdmin: () => admin, ClientSelect: ({ onChangeClient }: any) => <button onClick={() => onChangeClient('100')}>switch-account</button> }))
jest.mock('@/entities/Report', () => ({
    useGetCallJournalQuery: (...args: any[]) => journal(...args),
    useGetCallJournalOptionsQuery: (...args: any[]) => options(...args),
    useLazyGetCallJournalQuery: () => [fetchPage],
    useGetOperatorProjects: () => ({ currentData: [{ id: 5, userId: '99', callTaxonomy: [{ id: 'service', name: 'Service' }] }] }),
    useBatchProgress: () => ({ isActive: false, startPolling: jest.fn() }),
    isOperatorAnalyticsSource: (source: string) => source === 'external-api'
}))
jest.mock('@/features/OperatorAnalytics', () => ({ operatorCallScore: () => 90 }))
jest.mock('@/shared/ui/redesign-v3', () => ({ SidePanel: ({ isOpen, title, onClose, children }: any) => isOpen ? <div role="dialog" aria-label={title}><button onClick={onClose}>close</button>{children}</div> : null }))
jest.mock('../UploadModal/UploadModal', () => ({ UploadModal: () => null }))
jest.mock('./JournalDetail', () => ({ JournalDetail: ({ report }: any) => <output data-testid="native-detail">{report.channelId}</output> }))
jest.mock('xlsx', () => ({ utils: { json_to_sheet: jest.fn(), book_new: jest.fn(), book_append_sheet: jest.fn() }, write: () => new Uint8Array() }))
jest.mock('file-saver', () => ({ __esModule: true, default: { saveAs: (...args: any[]) => save(...args) } }))
jest.mock('../../lib/callsExportSheet', () => ({ buildCallsExportSheet: () => ({ rows: [], headers: [] }) }))

beforeEach(() => {
    admin = false
    journal.mockReturnValue({ currentData: data, isFetching: false, isError: false, refetch: jest.fn() })
    options.mockReturnValue({ currentData: { people: [{ value: person1, label: 'One' }, { value: person2, label: 'Two' }] }, isFetching: false })
    fetchPage.mockImplementation(() => ({ unwrap: async () => ({ ...data, count: 1 }), unsubscribe: jest.fn() }))
})

it('sends a real account-scoped server query and opens the native detail only after selecting a row', () => {
    render(<CallsJournal />)
    expect(journal).toHaveBeenLastCalledWith(expect.objectContaining({ userId: '99', page: 1, limit: 20 }), expect.anything())
    expect(screen.queryByTestId('native-detail')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('+70000000001'))
    expect(screen.getByTestId('native-detail')).toHaveTextContent('channel-one')
})

it('unions people and sources server-side and preserves the same scope on export', async () => {
    render(<CallsJournal />)
    fireEvent.click(screen.getByRole('button', { name: 'people', expanded: false }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'One' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Two' }))
    fireEvent.click(screen.getByRole('button', { name: 'people', expanded: true }))
    fireEvent.click(screen.getByRole('button', { name: 'sources', expanded: false }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'source_call' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'source_external-api' }))
    fireEvent.click(screen.getByRole('button', { name: 'sources', expanded: true }))
    const query = journal.mock.calls.at(-1)[0]
    expect(JSON.parse(query.people)).toEqual(expect.arrayContaining([JSON.parse(person1), JSON.parse(person2)]))
    expect(JSON.parse(query.sources)).toEqual(['call', 'external-api'])
    fireEvent.click(screen.getByRole('button', { name: 'export', exact: true }))
    await waitFor(() => { expect(fetchPage).toHaveBeenCalledWith(expect.objectContaining({ ...query, page: 1, limit: 1000 }), false) })
    await waitFor(() => { expect(save).toHaveBeenCalledTimes(1) })
})

it('does not mix paginated results with the old journal cache and resets page when changing topic', () => {
    render(<CallsJournal />)
    fireEvent.click(screen.getByRole('button', { name: 'nextPage' }))
    expect(journal.mock.calls.at(-1)[0].page).toBe(2)
    fireEvent.click(screen.getByRole('button', { name: 'Service' }))
    expect(journal.mock.calls.at(-1)[0]).toEqual(expect.objectContaining({ page: 1, tagId: 'service', projectId: '5' }))
    expect(screen.queryByTestId('native-detail')).not.toBeInTheDocument()
})

it('exports all server pages rather than only the currently displayed rows', async () => {
    journal.mockReturnValue({ currentData: { ...data, count: 1001 }, isFetching: false, isError: false, refetch: jest.fn() })
    fetchPage.mockImplementation(({ page }: any) => ({
        unwrap: async () => ({ count: 1001, totalCost: 0, rows: page === 1 ? Array.from({ length: 1000 }, (_, i) => ({ ...row, id: `row-${i}` })) : [{ ...row, id: 'row-1000' }] }),
        unsubscribe: jest.fn()
    }))
    render(<CallsJournal />)
    fireEvent.click(screen.getByRole('button', { name: 'export', exact: true }))
    await waitFor(() => { expect(save).toHaveBeenCalledTimes(1) })
    expect(fetchPage).toHaveBeenCalledTimes(2)
    expect(fetchPage).toHaveBeenNthCalledWith(2, expect.objectContaining({ page: 2, limit: 1000, userId: '99' }), false)
})

it('clears selected identities and project when an admin changes cabinet', () => {
    admin = true
    render(<CallsJournal />)
    fireEvent.click(screen.getByRole('button', { name: 'filters', exact: true }))
    fireEvent.click(screen.getByText('switch-account'))
    expect(journal.mock.calls.at(-1)[0]).toEqual(expect.objectContaining({ userId: '100', people: undefined, projectId: undefined, tagId: undefined }))
})

it('does not treat load failures as an empty successful query', () => {
    journal.mockReturnValue({ currentData: undefined, isFetching: false, isError: true, refetch: jest.fn() })
    render(<CallsJournal />)
    expect(screen.getByRole('alert')).toHaveTextContent('loadError')
    expect(screen.queryByText('emptyHint')).not.toBeInTheDocument()
})
