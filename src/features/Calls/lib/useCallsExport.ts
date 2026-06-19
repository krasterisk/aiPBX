import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { AllReports, CdrSource, serializeCsatFilter } from '@/entities/Report'
import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localstorage'

import { buildCallsExportSheet } from './callsExportSheet'

const FILE_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
const FILE_EXT = '.xlsx'

interface UseCallsExportParams {
    data: AllReports | undefined
    startDate?: string | null
    endDate?: string | null
    search?: string
    source?: CdrSource
    sortField?: string
    sortOrder?: 'ASC' | 'DESC'
    csatFilter?: string[]
}

/**
 * Fetch all reports directly (bypassing RTK Query cache which merges
 * paginated results and may return stale/partial data for export).
 */
async function fetchAllReportsDirect(params: {
    count: number
    startDate?: string
    endDate?: string
    search?: string
    source?: CdrSource
    sortField?: string
    sortOrder?: 'ASC' | 'DESC'
    csat?: string
}): Promise<AllReports> {
    const query = new URLSearchParams()
    query.set('page', '1')
    query.set('limit', String(Math.max(params.count, 10000)))
    query.set('search', params.search ?? '')
    query.set('userId', '')
    query.set('assistantId', '')
    query.set('startDate', params.startDate ?? '')
    query.set('endDate', params.endDate ?? '')
    if (params.sortField) query.set('sortField', params.sortField)
    if (params.sortOrder) query.set('sortOrder', params.sortOrder)
    if (params.source) query.set('source', params.source)
    if (params.csat) query.set('csat', params.csat)

    const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY)
    const res = await fetch(`${__API__}/reports/page?${query.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })

    if (!res.ok) throw new Error(`Export fetch failed: ${res.status}`)
    return await res.json()
}

export const useCallsExport = (params: UseCallsExportParams) => {
    const { data, startDate, endDate, search, source, sortField, sortOrder, csatFilter } = params
    const { t } = useTranslation('reports')
    const [exporting, setExporting] = useState(false)

    const exportToExcel = useCallback(async () => {
        if (!data?.count) return
        setExporting(true)
        try {
            // Direct fetch bypasses RTK Query cache to get ALL records
            const allData = await fetchAllReportsDirect({
                count: data.count,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                search: search || undefined,
                source,
                sortField,
                sortOrder,
                csat: serializeCsatFilter(csatFilter),
            })

            if (!allData?.rows?.length) return

            const { rows, headers } = buildCallsExportSheet(allData.rows, t)

            const ws = XLSX.utils.json_to_sheet(rows, { header: headers })
            ws['!cols'] = headers.map(h => ({
                wch: h === String(t('Саммари')) || h === String(t('Транскрипт')) || h === String(t('Обоснование метрик'))
                    ? 48
                    : Math.min(Math.max(h.length, 12), 28),
            }))
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, 'calls')
            const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
            FileSaver.saveAs(new Blob([buffer], { type: FILE_TYPE }), 'calls_export' + FILE_EXT)
        } finally {
            setExporting(false)
        }
    }, [data?.count, startDate, endDate, search, source, sortField, sortOrder, csatFilter, t])

    return { exportToExcel, exporting }
}
