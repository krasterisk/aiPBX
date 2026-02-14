import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportList.module.scss'
import React, { useCallback, useState } from 'react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Report, ReportsListProps } from '../../model/types/report'
import { ErrorGetData } from '../../../ErrorGetData'
import { ContentListItemSkeleton } from '../../../Content'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { ReportsListHeader } from '../ReportListHeader/ReportListHeader'
import { ReportTable } from '../ReportTable/ReportTable'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { formatDate } from '@/shared/lib/functions/formatDate'
import { formatTime } from '@/shared/lib/functions/formatTime'
import { ReportListActions } from '../ReportListActions/ReportListActions'
import { useReportFilters } from '../../lib/useReportFilters'
import { ArrowUp, ArrowDown } from 'lucide-react'

export const ReportList = (props: ReportsListProps) => {
  const {
    className,
    isReportsError,
    isReportsLoading,
    reports,
    target
  } = props

  const { t } = useTranslation('reports')

  const [checkedBox, setCheckedBox] = useState<string[]>([])
  const [indeterminateBox, setIndeterminateBox] = useState<boolean>(false)

  const { sortField, sortOrder, onChangeSort } = useReportFilters()

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortOrder === 'ASC'
      ? <ArrowUp size={14} className={cls.sortIcon} />
      : <ArrowDown size={14} className={cls.sortIcon} />
  }

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setCheckedBox((prev) => {
      const currentIndex = prev.indexOf(value)
      const newChecked = [...prev]
      if (currentIndex === -1) {
        newChecked.push(value)
      } else {
        newChecked.splice(currentIndex, 1)
      }

      const currentRowsCount = reports?.rows.length || 0
      setIndeterminateBox(newChecked.length > 0 && newChecked.length < currentRowsCount)

      return newChecked
    })
  }

  const exportToExcel = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    if (reports) {
      const rowsToExport = checkedBox.length > 0
        ? reports.rows.filter(report => checkedBox.includes(String(report.id)))
        : reports.rows

      const exportData = rowsToExport.map((report, index) => ({
        '№': index + 1,
        Date: report.createdAt ? formatDate(report.createdAt) : '',
        'Assistant:': report.assistantName,
        'CallerId:': report.callerId ? report.callerId : '',
        'Duration:': report.duration && formatTime(report.duration, t),
        'Tokens:': report.tokens && report.tokens,
        'Cost:': report.cost && report.cost
      }))

      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'data')
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const data = new Blob([excelBuffer], { type: fileType })
      FileSaver.saveAs(data, 'reports_list' + fileExtension)
    }
  }

  const handleCheckAll = useCallback(() => {
    if (!reports) return
    const currentRowsCount = reports.rows.length

    if (checkedBox.length === currentRowsCount) {
      setCheckedBox([])
      setIndeterminateBox(false)
    } else {
      setCheckedBox(reports.rows.map(report => String(report.id)))
      setIndeterminateBox(false)
    }
  }, [checkedBox.length, reports])

  const getSkeletons = () => {
    return new Array(4)
      .fill(0)
      .map((item, index) => (
        <ContentListItemSkeleton className={cls.skeleton} key={index} view={'BIG'} />
      ))
  }

  if (isReportsError) {
    return (
      <ErrorGetData />
    )
  }

  const renderTableContent = (report: Report) => {
    return (
      <ReportTable
        key={report.id}
        report={report}
        checkedItems={checkedBox}
        onChangeChecked={handleCheckChange}
        target={target}
        className={cls.TableItem}
      />
    )
  }

  return (
    <VStack gap="16" max className={classNames(cls.ReportListWrapper, {}, [className])}>
      <ReportsListHeader />

      <ReportListActions
        reports={reports}
        checkedBox={checkedBox}
        indeterminateBox={indeterminateBox}
        onCheckAll={handleCheckAll}
        onExportToExcel={exportToExcel}
      />

      {reports?.rows.length ? (
        <div className={cls.TableWrapper}>
          <table className={cls.Table}>
            <thead className={cls.TableHeader}>
              <tr>
                <th className={cls.tdCheck}></th>
                <th className={cls.sortable} onClick={() => onChangeSort('createdAt')}>
                  {t('Дата')} {renderSortIcon('createdAt')}
                </th>
                <th className={cls.sortable} onClick={() => onChangeSort('assistantName')}>
                  {t('Ассистент')} {renderSortIcon('assistantName')}
                </th>
                <th className={cls.sortable} onClick={() => onChangeSort('callerId')}>
                  {t('Звонивший')} {renderSortIcon('callerId')}
                </th>
                <th className={cls.sortable} onClick={() => onChangeSort('duration')}>
                  {t('Длительность')} {renderSortIcon('duration')}
                </th>
                <th className={cls.sortable} onClick={() => onChangeSort('tokens')}>
                  {t('Токены')} {renderSortIcon('tokens')}
                </th>
                <th className={cls.sortable} onClick={() => onChangeSort('cost')}>
                  {t('Стоимость')} {renderSortIcon('cost')}
                </th>
                <th className={cls.sortable} onClick={() => onChangeSort('csat')}>
                  {t('CSAT')} {renderSortIcon('csat')}
                </th>
                <th className={cls.sortable} onClick={() => onChangeSort('scenarioSuccess')}>
                  {t('Результат')} {renderSortIcon('scenarioSuccess')}
                </th>
                <th className={cls.tdActions}></th>
              </tr>
            </thead>
            <tbody className={cls.TableBody}>
              {reports?.rows.map(renderTableContent)}
            </tbody>
          </table>
        </div>
      ) : (
        !isReportsLoading && (
          <Card padding="48" max border="partial">
            <VStack max align="center" justify="center" gap="16">
              <Text align="center" title={t('Данные не найдены')} />
              <Text align="center" text={t('Попробуйте изменить параметры поиска или фильтры')} />
            </VStack>
          </Card>
        )
      )}

      {isReportsLoading && (
        <VStack gap="12" max>
          {getSkeletons()}
        </VStack>
      )}
    </VStack>
  )
}
