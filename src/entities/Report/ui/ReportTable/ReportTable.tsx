import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportTable.module.scss'
import React, { HTMLAttributeAnchorTarget, memo, useCallback, useState } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { Check } from '@/shared/ui/mui/Check'
import { Report } from '../../model/types/report'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useGetReportDialogs } from '../../api/reportApi'
import { formatTime } from '@/shared/lib/functions/formatTime'
import { useMediaQuery } from '@mui/material'
import { ReportShowDialog } from '../ReportShowDialog/ReportShowDialog'
import { useSelector } from 'react-redux'
import { getUserAuthData, UserCurrencyValues } from '@/entities/User'
import { formatCurrency } from '@/shared/lib/functions/formatCurrency'
import { Button } from '@/shared/ui/redesigned/Button'
import { ChartBar, Sparkles } from 'lucide-react'
import { Loader } from '@/shared/ui/Loader'
import { ReportShowAnalytics } from '../ReportShowAnalytics/ReportShowAnalytics'
import { useCreateCallAnalytics } from '../../api/reportApi'

interface ReportTableProps {
  className?: string
  report: Report
  target?: HTMLAttributeAnchorTarget
  checkedItems?: string[]
  onChangeChecked?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const ReportTable = memo((props: ReportTableProps) => {
  const {
    className,
    report,
    checkedItems,
    onChangeChecked
  } = props

  const { t } = useTranslation(['reports', 'translation'])
  const authData = useSelector(getUserAuthData)
  const userCurrency = UserCurrencyValues.USD || authData?.currency

  const [expandedView, setExpandedView] = useState<'none' | 'dialog' | 'analytics'>('none')

  const {
    data: Dialogs,
    isLoading: isDialogLoading,
    isError: isDialogError
  } = useGetReportDialogs(report.channelId, {
    skip: expandedView !== 'dialog',
    refetchOnFocus: false,
    refetchOnReconnect: false
  })

  const [createCallAnalytics, { isLoading: isAnalyticsLoading }] = useCreateCallAnalytics()

  // Localized date formatting
  const date = new Date(report.createdAt)
  const formattedDate = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date)

  const onShowDialog = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedView(prev => prev === 'dialog' ? 'none' : 'dialog')
  }, [])

  const onShowAnalytics = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedView(prev => prev === 'analytics' ? 'none' : 'analytics')
  }, [])

  const onGetAnalytics = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await createCallAnalytics(report.channelId).unwrap()
      setExpandedView('analytics')
    } catch (e) {
      console.error(e)
    }
  }, [createCallAnalytics, report.channelId])

  const mediaUrl = report.recordUrl || ''
  const duration = report.duration ? formatTime(report.duration, t) : ''
  const isMobile = useMediaQuery('(max-width:800px)')

  const viewMode = isMobile ? 'SMALL' : 'BIG'

  const onCheckClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  const isChecked = checkedItems?.includes(String(report.id))

  const totalTokens = (report.tokens || 0)
  const totalCost = (report.cost || 0)

  return (
    <>
      <tr
        className={classNames(cls.ReportTableItem, {}, [className, viewMode])}
        onClick={onShowDialog}
      >
        <td className={cls.tdCheck} onClick={onCheckClick}>
          <Check
            key={report.id}
            className={classNames('', { [cls.check]: isChecked }, [])}
            value={report.id}
            size="small"
            checked={isChecked}
            onChange={onChangeChecked}
          />
        </td>
        <td data-label={t('Дата')}>
          {report.createdAt ? <Text text={formattedDate} /> : ''}
        </td>
        <td data-label={t('Ассистент')}>
          {report.assistantName ? <Text text={report.assistantName} /> : ''}
        </td>
        <td data-label={t('Звонивший')}>
          {report.callerId ? <Text text={report.callerId} /> : ''}
        </td>
        <td data-label={t('Длительность')}>
          <Text text={String(duration)} />
        </td>
        <td data-label={t('Токены')}>
          {totalTokens ? <Text text={String(totalTokens)} /> : ''}
        </td>
        <td data-label={t('Стоимость')}>
          {totalCost ? <Text text={formatCurrency(totalCost, userCurrency, 4)} bold /> : ''}
        </td>
        <td className={cls.actionsTd} onClick={(e) => e.stopPropagation()}>
          <div className={cls.actions}>
            {report.analytics
              ? (
                <Button
                  variant="clear"
                  onClick={onShowAnalytics}
                  title={String(t('Показать аналитику'))}
                >
                  <ChartBar size={24} color={expandedView === 'analytics' ? 'var(--accent-redesigned)' : 'var(--icon-redesigned)'} />
                </Button>
              )
              : (
                <Button
                  variant="clear"
                  onClick={onGetAnalytics}
                  disabled={isAnalyticsLoading}
                  title={String(t('Получить аналитику'))}
                >
                  {isAnalyticsLoading ? <Loader className={cls.btnLoader} /> : <Sparkles size={24} />}
                </Button>
              )
            }
            <Button
              variant="clear"
              onClick={onShowDialog}
            >
              {expandedView === 'dialog'
                ? <ChevronUp className={cls.expandIcon} size={24} />
                : <ChevronDown className={cls.expandIcon} size={24} />
              }
            </Button>
          </div>
        </td>
      </tr>
      {expandedView !== 'none' && (
        <tr className={cls.DialogRow}>
          <td colSpan={8}>
            {expandedView === 'dialog' && (
              <ReportShowDialog
                Dialogs={Dialogs}
                isDialogLoading={isDialogLoading}
                isDialogError={isDialogError}
                mediaUrl={mediaUrl}
              />
            )}
            {expandedView === 'analytics' && report.analytics && (
              <ReportShowAnalytics
                analytics={report.analytics}
              />
            )}
          </td>
        </tr>
      )}
    </>
  )
})
