import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { AllReports, CdrSource, useLazyGetReports } from '@/entities/Report'
import { formatDate } from '@/shared/lib/functions/formatDate'
import { formatTime } from '@/shared/lib/functions/formatTime'
import { formatCurrency } from '@/shared/lib/functions/formatCurrency'

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

export const useCallsExport = (params: UseCallsExportParams) => {
    const { data, startDate, endDate, search, source, sortField, sortOrder } = params
    const { t } = useTranslation('reports')
    const [fetchAllReports] = useLazyGetReports()
    const [exporting, setExporting] = useState(false)

    const exportToExcel = useCallback(async () => {
        if (!data?.count) return
        setExporting(true)
        try {
            // Fetch ALL records matching current filters
            const allData = await fetchAllReports({
                limit: data.count + 1000,
                page: 1,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                search: search || undefined,
                source,
                sortField,
                sortOrder,
            }).unwrap()

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
    }, [data?.count, fetchAllReports, startDate, endDate, search, source, sortField, sortOrder, t])

    return { exportToExcel, exporting }
}
