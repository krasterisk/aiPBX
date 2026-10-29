import { act, fireEvent, render, screen } from '@testing-library/react'
import { JournalDetail } from './JournalDetail'
let mockAdmin = false
const mockRegenerate = jest.fn(() => ({ unwrap: async () => ({}) }))
const mockRemove = jest.fn(() => ({ unwrap: async () => ({}) }))
const mockRefetch = jest.fn()
const mockHistory = jest.fn<any, any[]>(() => ({}))
const report: any = { id: '7', channelId: 'call-7', createdAt: '2026-10-26T03:00:00Z', callerId: '+70000000000', source: 'external-api', duration: 83, callType: 'outgoing', recordUrl: 'https://example.com/demo.mp3', transcription: JSON.stringify([{ speaker: 'operator', text: 'Hello', start: 15.36 }, { speaker: 'customer', text: 'Hi', start: 18 }]), analytics: { qualityScore: 80, metrics: { politeness_empathy: 100, custom_metrics: { greeting: true }, _custom_meta: { greeting: { name: 'Greeting', type: 'boolean' } } } }, billingRecords: [{ id: 1, type: 'analytic', totalCost: 1, textCost: 0.8, sttCost: 0.2, currency: 'USD' }] }
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }) }))
jest.mock('react-redux', () => ({ useSelector: (fn: any) => fn() }))
jest.mock('@/entities/User', () => ({ isUserAdmin: () => mockAdmin }))
jest.mock('@/entities/Report', () => ({
 ...jest.requireActual('@/entities/Report/model/types/quality'),
 useGetQualityDetailQuery: () => ({ currentData: { record: report, analytics: report.analytics }, refetch: mockRefetch }),
 useGetQualityHistoryQuery: (...args: any[]) => mockHistory(...args),
useAnalyzeQualityPreviewMutation: () => [jest.fn(), {}],
 useGetReportDialogs: () => ({}),
isOperatorAnalyticsSource: () => true,
 useRegenerateCallFreeMutation: () => [mockRegenerate, {}],
useDeleteReport: () => [mockRemove, {}]
}))
jest.mock('@/shared/ui/redesign-v3', () => ({ SidePanel: () => null, AudioPlayback: ({ label, children }: any) => <div><button>{label}</button>{children}</div> }))
jest.mock('./QualityCorrectionEditor', () => ({ QualityCorrectionEditor: () => null }))
beforeEach(() => { mockAdmin = false; jest.clearAllMocks() })
it('shows the same published all-metric score used by the journal and dashboard adapter', () => {
    const original = report.analytics
    report.analytics = { qualityStatus: 'scored', qualityScore: 37.5, metrics: {
        politeness_empathy: 100, speech_clarity_pace: 100,
        custom_metrics: { greeting: false, introduction: false, clinic: false, name: false,
            branch: true, appointment: null, offer: false, source: null }
    } }
    try {
        render(<JournalDetail report={report} />)
        expect(screen.getByText('metricScore').parentElement).toHaveTextContent('37.5/100')
    } finally { report.analytics = original }
})
it('does not show internal provenance or request score history for customers', () => {
    render(<JournalDetail report={report} />)
    expect(screen.queryByText('quality_legacy')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'qualityHistory' })).not.toBeInTheDocument()
    expect(mockHistory.mock.calls.at(-1)?.[1]).toMatchObject({ skip: true })
})
it('keeps internal provenance and history only in administrator Data', () => {
    mockAdmin = true
    render(<JournalDetail report={report} />)
    expect(screen.queryByRole('button', { name: 'qualityHistory' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: 'detail_metadata' }))
    expect(screen.getByText('quality_legacy')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'qualityHistory' }))
    expect(mockHistory.mock.calls.at(-1)?.[1]).toMatchObject({ skip: false })
})
it('keeps metrics, supervisor and customer costs in overview, with no Data tab or admin actions for clients', () => {
 render(<JournalDetail report={report}/>); expect(screen.getByText('detail_metrics')).toBeInTheDocument(); expect(screen.getByText('supervisor')).toBeInTheDocument(); expect(screen.getByText('callCost')).toBeInTheDocument(); expect(screen.queryByRole('tab', { name: 'detail_metadata' })).not.toBeInTheDocument(); expect(screen.queryByText('regenerateFree')).not.toBeInTheDocument(); expect(screen.queryByText('copyId')).not.toBeInTheDocument(); expect(screen.getByRole('heading', { name: '+70000000000' }).nextElementSibling).toHaveTextContent('type_outgoing')
 fireEvent.click(screen.getByRole('tab', { name: 'detail_transcript' })); expect(screen.getByText('00:15')).toBeInTheDocument(); expect(screen.getByText('Hello').parentElement).toHaveAttribute('data-role', 'operator'); expect(screen.getByText('Hi').parentElement).toHaveAttribute('data-role', 'customer')
})
it('places admin actions in Data and requires a separate deletion confirmation', async() => {
 mockAdmin = true; render(<JournalDetail report={report}/>); expect(screen.queryByText('regenerateFree')).not.toBeInTheDocument(); fireEvent.click(screen.getByRole('tab', { name: 'detail_metadata' })); fireEvent.click(screen.getByRole('button', { name: 'regenerateFree' })); expect(mockRegenerate).toHaveBeenCalledWith({ channelId: 'call-7', operator: true }); fireEvent.click(screen.getByRole('button', { name: 'deleteCall' })); expect(mockRemove).not.toHaveBeenCalled(); fireEvent.click(screen.getByRole('button', { name: 'confirmDelete' })); expect(mockRemove).toHaveBeenCalledWith('7'); await act(async() => { await Promise.resolve() })
})
