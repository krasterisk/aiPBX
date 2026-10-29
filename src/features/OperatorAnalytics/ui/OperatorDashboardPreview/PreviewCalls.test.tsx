import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import * as XLSX from 'xlsx'
import { PreviewCalls } from './PreviewCalls'

const cdrs = jest.fn()
const fetchExport = jest.fn()
const save = jest.fn()
jest.mock('file-saver', () => ({ saveAs: (...args: any[]) => save(...args) }))
jest.mock('@/entities/Report', () => ({ ...jest.requireActual('@/entities/Report/model/types/quality'), useQualityCdrsQuery: (...args: any[]) => cdrs(...args), useLazyQualityCdrsQuery: () => [fetchExport] }))
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

it('renders native CDR nested metrics and opens the analysis channel rather than the row ID', () => {
    cdrs.mockReturnValue({
        currentData: {
            data: [
                {
                    id: 'cdr-1',
                    channelId: 'analysis-7',
                    createdAt: '2026-10-24T06:00:00Z',
                    assistantName: 'Demo operator',
                    callerId: '+7 900 000-00-00',
                    duration: 72,
                    analytics: { qualityStatus: 'scored', qualityScore: 65, metrics: { greeting_quality: 100 } }
                }
            ],
            total: 1
        },
        isFetching: false,
        isError: false
    })
    const onOpen = jest.fn()
    render(
        <PreviewCalls query={{ userId: '99', projectId: '5' }} page={1} search="" onPage={jest.fn()} onSearch={jest.fn()} onOpen={onOpen} />
    )
    expect(screen.getByText('65')).toBeInTheDocument()
    expect(screen.getByText('Demo operator')).toBeInTheDocument()
    expect(screen.getByText('+7 900 000-00-00')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('type_incoming'))
    fireEvent.click(screen.getByText('65'))
    expect(onOpen).not.toHaveBeenCalled()
    fireEvent.focus(screen.getByText('65'))
    expect(screen.getByText('65').closest('[tabindex]')).toHaveAttribute('aria-label', 'callScoreHint')
    fireEvent.click(screen.getByRole('button', { name: 'openCall' }))
    expect(onOpen).toHaveBeenCalledWith('analysis-7')
    expect(cdrs).toHaveBeenCalledWith(expect.objectContaining({ userId: '99', projectId: '5', limit: 10, sortField: 'createdAt' }))
})

it('exports every filtered page to Excel even when the sheet displays page three', async () => {
    const selected = Array.from({ length: 501 }, (_, i) => ({ id: String(i), createdAt: '2026-10-27T06:00:00Z', assistantName: 'Operator', callerId: i === 500 ? '=SUM(1,1)' : String(i), duration: 60 }))
    cdrs.mockReturnValue({ currentData: { data: selected.slice(20, 30), total: 501 }, isFetching: false })
    const unsubscribe = jest.fn()
    fetchExport.mockImplementation(({ page, limit }: any) => ({ unwrap: async () => ({ data: selected.slice((page - 1) * limit, page * limit), total: 501 }), unsubscribe }))
    const query = { userId: '99', projectId: '5', tagIds: '["service"]', success: false, operatorFilters: '[{"operatorId":"207"}]', startDate: '2026-10-01', endDate: '2026-10-27', callType: 'incoming' as const }
    try {
        render(<PreviewCalls query={query} page={3} search="results" onPage={jest.fn()} onSearch={jest.fn()} onOpen={jest.fn()} />)
        fireEvent.click(screen.getByRole('button', { name: 'exportAll' }))
        await waitFor(() => { expect(save).toHaveBeenCalled() })
        expect(fetchExport).toHaveBeenCalledTimes(2)
        for (const page of [1, 2]) expect(fetchExport).toHaveBeenCalledWith({ ...query, search: 'results', page, limit: 500, sortField: 'id', sortOrder: 'DESC' }, false)
        expect(unsubscribe).toHaveBeenCalledTimes(2)
        const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => { resolve(reader.result as ArrayBuffer) }
            reader.onerror = reject
            reader.readAsArrayBuffer(save.mock.calls[0][0])
        })
        const workbook = XLSX.read(buffer, { type: 'array' })
        const sheet = workbook.Sheets.calls
        expect(XLSX.utils.sheet_to_json(sheet)).toHaveLength(501)
        expect(sheet.D502).toMatchObject({ t: 's', v: '=SUM(1,1)' })
        expect(sheet.D502.f).toBeUndefined()
        expect(save.mock.calls[0][1]).toBe('call-records.xlsx')
    } finally { fetchExport.mockClear(); save.mockClear() }
})

it('does not download a partial file when a later page fails and allows retry', async () => {
    cdrs.mockReturnValue({ currentData: { data: [{ id: 'one', createdAt: '2026-10-27T06:00:00Z' }], total: 2 }, isFetching: false })
    const unsubscribe = jest.fn()
    fetchExport.mockImplementation(({ page }: any) => ({
        unwrap: async () => {
            if (page === 2) throw new Error('Network unavailable')
            return { data: [{ id: 'one' }], total: 2 }
        },
        unsubscribe
    }))
    render(<PreviewCalls query={{ projectId: '5' }} page={1} search="" onPage={jest.fn()} onSearch={jest.fn()} onOpen={jest.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'exportAll' }))
    await waitFor(() => { expect(screen.getByRole('alert')).toHaveTextContent('exportError') })
    expect(save).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'exportAll' })).toBeEnabled()
    expect(unsubscribe).toHaveBeenCalledTimes(2)
})
