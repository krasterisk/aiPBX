import { fireEvent, render, screen } from '@testing-library/react'
import { QualityJournal } from './CallsJournal'

const query = jest.fn()
const options = jest.fn()
const row: any = { id: 'one', channelId: 'one', userId: '99', projectId: 5, source: 'external-api', callerId: '+70000000001', createdAt: '2026-10-25T07:00:00Z', analytics: { qualityStatus: 'scored', qualityScore: 86.25, csat: 4 } }
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }) }))
jest.mock('react-redux', () => ({ useSelector: (fn: any) => fn() }))
jest.mock('react-router-dom', () => ({ Link: ({ children }: any) => <span>{children}</span> }))
jest.mock('@/entities/User', () => ({ getUserAuthData: () => ({ id: '1', vpbx_user_id: '99' }), isUserAdmin: () => true, ClientFilter: () => null }))
jest.mock('@/entities/Report', () => ({
    ...jest.requireActual('@/entities/Report/model/types/quality'),
    ...jest.requireActual('@/entities/Report/lib/reportDisplayMoneyInput'),
    useQualityJournalQuery: (...args: any[]) => query(...args),
    useLazyQualityJournalQuery: () => [jest.fn()],
    useGetCallJournalOptionsQuery: (...args: any[]) => { options(...args); return { currentData: { people: [] } } },
    useGetOperatorProjects: () => ({ currentData: [{ id: 5, userId: '99', name: 'Clinic', callTaxonomy: [{ id: 'a', name: 'Topic A' }, { id: 'b', name: 'Topic B' }] }] }),
    useBatchProgress: () => ({ isActive: false }),
    isOperatorAnalyticsSource: () => true
}))
jest.mock('@/features/OperatorAnalytics', () => ({ QualityRulesEditor: () => <p>isolated-rules</p> }))
jest.mock('@/shared/ui/redesign-v3', () => ({ ...jest.requireActual('@/shared/ui/redesign-v3/SelectControl'), ...jest.requireActual('@/shared/ui/redesign-v3/FilterPanel'), SidePanel: ({ isOpen, children }: any) => isOpen ? <div role="dialog">{children}</div> : null }))
jest.mock('./JournalDetail', () => ({ JournalDetail: () => <p>isolated-detail</p> }))
jest.mock('xlsx', () => ({}))
jest.mock('file-saver', () => ({}))
beforeEach(() => { query.mockReturnValue({ currentData: { rows: [row], count: 1 }, refetch: jest.fn() }) })

it('shows the charged currency rounded to two places after duration and sorts by cost', () => {
    query.mockReturnValue({ currentData: { rows: [{ ...row, duration: 60, cost: 0.15, amountCurrency: 12.345, costCurrency: 'RUB' }], count: 1 }, refetch: jest.fn() })
    render(<QualityJournal />)
    const cells = screen.getAllByRole('row')[1].querySelectorAll('td')
    expect(cells[7]).toHaveTextContent('01:00')
    expect(cells[8]).toHaveTextContent('RUB')
    expect(cells[8].textContent).toContain('12.35')
    fireEvent.click(screen.getByRole('button', { name: 'cost' }))
    expect(query.mock.calls.at(-1)[0]).toMatchObject({ sortField: 'cost', sortOrder: 'DESC' })
})

it('shows published quality separately from CSAT and sorts through the isolated server endpoint', () => {
    render(<QualityJournal />)
    expect(screen.getByText('86.3')).toBeInTheDocument()
    expect(screen.queryByText('previewNotice')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'upload' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /score/ }))
    expect(query.mock.calls.at(-1)[0]).toMatchObject({ sortField: 'qualityScore', sortOrder: 'DESC' })
    fireEvent.click(screen.getByRole('button', { name: /score/ }))
    expect(query.mock.calls.at(-1)[0].sortOrder).toBe('ASC')
    fireEvent.click(screen.getAllByRole('row')[1])
    expect(screen.getByText('isolated-detail')).toBeInTheDocument()
})

it('supports a union of topics in the same server/export query and resets it', () => {
 render(<QualityJournal/>); fireEvent.click(screen.getAllByRole('button', { name: 'topic' })[0]); fireEvent.click(screen.getByRole('checkbox', { name: 'Topic A' })); fireEvent.click(screen.getByRole('checkbox', { name: 'Topic B' })); expect(query.mock.calls.at(-1)[0]).toMatchObject({ tagIds: '["a","b"]' }); fireEvent.click(screen.getByRole('button', { name: 'reset' })); expect(query.mock.calls.at(-1)[0].tagIds).toBeUndefined()
})

it('replaces selected topics through the row shortcut without leaving a hidden legacy filter', () => {
    query.mockReturnValue({ currentData: { rows: [{ ...row, analytics: { ...row.analytics, metrics: { _topics: { tags: ['a'], tag_names: { a: 'Topic A' } } } } }], count: 1 }, refetch: jest.fn() })
    render(<QualityJournal />)
    fireEvent.click(screen.getAllByRole('button', { name: 'topic' })[0])
    fireEvent.click(screen.getByRole('checkbox', { name: 'Topic B' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'topic' })[0])
    fireEvent.click(screen.getAllByRole('row')[1].querySelector('button')!)
    expect(query.mock.calls.at(-1)[0]).toMatchObject({ tagIds: '["a"]' })
    expect(query.mock.calls.at(-1)[0].tagId).toBeUndefined()
})
it('requests people for the current search and topics without pagination or its own selection', () => {
    render(<QualityJournal />)
    const search = screen.getByRole('searchbox', { name: 'search' })
    fireEvent.change(search, { target: { value: 'results' } })
    fireEvent.submit(search.closest('form')!)
    fireEvent.click(screen.getAllByRole('button', { name: 'topic' })[0])
    fireEvent.click(screen.getByRole('checkbox', { name: 'Topic A' }))
    expect(options.mock.calls.at(-1)[0]).toMatchObject({ search: 'results', tagIds: '["a"]', startDate: expect.any(String), endDate: expect.any(String) })
    for (const key of ['people', 'page', 'limit', 'sortField', 'sortOrder']) expect(options.mock.calls.at(-1)[0][key]).toBeUndefined()
})
