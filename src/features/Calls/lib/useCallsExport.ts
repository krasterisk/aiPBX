import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { AllReports, CdrSource } from '@/entities/Report'
import { formatDate } from '@/shared/lib/functions/formatDate'
import { formatTime } from '@/shared/lib/functions/formatTime'
import { formatCurrency } from '@/shared/lib/functions/formatCurrency'
import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localstorage'

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
}): Promise<AllReports> {
    const query = new URLSearchParams()
    query.set('page', '1')
    query.set('limit', String(Math.max(params.count, 10000)))
    if (params.startDate) query.set('startDate', params.startDate)
    if (params.endDate) query.set('endDate', params.endDate)
    if (params.search) query.set('search', params.search)
    if (params.source) query.set('source', params.source)
    if (params.sortField) query.set('sortField', params.sortField)
    if (params.sortOrder) query.set('sortOrder', params.sortOrder)

    const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY)
    const res = await fetch(`${__API__}/reports/page?${query.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })

    if (!res.ok) throw new Error(`Export fetch failed: ${res.status}`)
    return res.json()
}

export const useCallsExport = (params: UseCallsExportParams) => {
    const { data, startDate, endDate, search, source, sortField, sortOrder } = params
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
            })

            if (!allData?.rows?.length) return

            const rows = allData.rows.map((report, index) => ({
                '№': index + 1,
                [String(t('Дата'))]: report.createdAt ? formatDate(report.createdAt) : '',
                [String(t('Ассистент'))]: report.assistantName ?? '',
                [String(t('Звонивший'))]: report.callerId ?? '',
                [String(t('Источник'))]: report.source ?? '',
                [String(t('Длительность'))]: report.duration ? formatTime(report.duration, t) ?? '' : '',
                [String(t('Токены'))]: report.tokens ?? '',
                [String(t('Стоимость'))]: report.cost ? formatCurrency(report.cost, 'USD', 4) : '',
                CSAT: report.analytics?.csat ?? '',
                [String(t('Настроение'))]: report.analytics?.sentiment ?? '',
                [String(t('Результат'))]: report.analytics?.metrics?.scenario_analysis?.success != null
                    ? (report.analytics.metrics.scenario_analysis.success ? t('Успех') : t('Эскалация'))
                    : ''
            }))

            const ws = XLSX.utils.json_to_sheet(rows)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, 'calls')
            const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
            FileSaver.saveAs(new Blob([buffer], { type: FILE_TYPE }), 'calls_export' + FILE_EXT)
        } finally {
            setExporting(false)
        }
    }, [data?.count, startDate, endDate, search, source, sortField, sortOrder, t])

    return { exportToExcel, exporting }
}
