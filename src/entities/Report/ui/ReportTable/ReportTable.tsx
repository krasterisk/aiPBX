import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportTable.module.scss'
import React, { HTMLAttributeAnchorTarget, memo, useCallback, useState } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { Check } from '@/shared/ui/mui/Check'
import { Report } from '../../model/types/report'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp, Star, CheckCircle, AlertCircle, Phone, Globe, Monitor } from 'lucide-react'
import { useGetReportDialogs, useCreateCallAnalytics } from '../../api/reportApi'
import { formatTime } from '@/shared/lib/functions/formatTime'
import { useMediaQuery } from '@mui/material'
import { useSelector } from 'react-redux'
import { getUserAuthData, UserCurrencyValues } from '@/entities/User'
import { formatCurrency } from '@/shared/lib/functions/formatCurrency'
import { Button } from '@/shared/ui/redesigned/Button'

import { ReportExpandedPanel } from '../ReportExpandedPanel/ReportExpandedPanel'

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

  const [isExpanded, setIsExpanded] = useState(false)

  const {
    data: Dialogs,
    isLoading: isDialogLoading,
    isError: isDialogError
  } = useGetReportDialogs(report.channelId, {
    skip: !isExpanded,
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

  const onToggleExpanded = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(prev => !prev)
  }, [])

  const onGetAnalytics = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await createCallAnalytics(report.channelId).unwrap()
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

  const sourceLabel = {
    call: t('Звонок'),
    widget: t('Виджет'),
    playground: t('Playground')
  }

  const sourceIcon = {
    call: <Phone size={14} />,
    widget: <Globe size={14} />,
    playground: <Monitor size={14} />
  }

  // Analytics-derived fields
  const csat = report.analytics?.csat
  const scenarioSuccess = report.analytics?.metrics?.scenario_analysis?.success

  return (
    <>
      <tr
        className={classNames(cls.ReportTableItem, { [cls.expanded]: isExpanded }, [className, viewMode])}
        onClick={onToggleExpanded}
        id={`report-row-${report.id}`}
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
        <td data-label={t('Источник')} className={cls.sourceCell}>
          {report.source
? (
            <span className={cls.sourceBadge} data-source={report.source}>
              {sourceIcon[report.source]}
              {sourceLabel[report.source]}
            </span>
          )
: '—'}
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
        <td data-label={t('CSAT')} className={cls.csatCell}>
          {csat != null
? (
            <span className={cls.csatValue}>
              <Star size={14} className={cls.csatStar} />
              {csat}
            </span>
          )
: '—'}
        </td>
        <td data-label={t('Результат')} className={cls.resultCell}>
          {scenarioSuccess === true && (
            <span className={cls.successText}>
              <CheckCircle size={16} />
              {t('Успех')}
            </span>
          )}
          {scenarioSuccess === false && (
            <span className={cls.escalationText}>
              <AlertCircle size={16} />
              {t('Эскалация')}
            </span>
          )}
          {scenarioSuccess == null && '—'}
        </td>
        <td className={cls.actionsTd} onClick={(e) => { e.stopPropagation() }}>
          <div className={cls.actions}>
            <Button
              variant="clear"
              onClick={onToggleExpanded}
              id={`report-expand-${report.id}`}
            >
              {isExpanded
                ? <ChevronUp className={cls.expandIcon} size={24} />
                : <ChevronDown className={cls.expandIcon} size={24} />
              }
            </Button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr className={cls.DialogRow}>
          <td colSpan={11}>
            <ReportExpandedPanel
              report={report}
              dialogs={Dialogs}
              isDialogLoading={isDialogLoading}
              isDialogError={isDialogError}
              mediaUrl={mediaUrl}
              onGetAnalytics={onGetAnalytics}
              isAnalyticsLoading={isAnalyticsLoading}
            />
          </td>
        </tr>
      )}
    </>
  )
})
