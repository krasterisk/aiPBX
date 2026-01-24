import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportTable.module.scss'
import React, { HTMLAttributeAnchorTarget, memo, useCallback, useState } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { Check } from '@/shared/ui/mui/Check'
import { Report } from '../../model/types/report'
import { useTranslation } from 'react-i18next'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { Button } from '@/shared/ui/redesigned/Button'
import { useGetReportDialogs } from '../../api/reportApi'
import { formatTime } from '@/shared/lib/functions/formatTime'
import { useMediaQuery } from '@mui/material'
import { ReportShowDialog } from '../ReportShowDialog/ReportShowDialog'
import { useSelector } from 'react-redux'
import { getUserAuthData, UserCurrencyValues } from '@/entities/User'
import { formatCurrency } from '@/shared/lib/functions/formatCurrency'

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
  const userCurrency = authData?.currency || UserCurrencyValues.USD

  const [showDialog, setShowDialog] = useState(false)

  const {
    data: Dialogs,
    isLoading: isDialogLoading,
    isError: isDialogError
  } = useGetReportDialogs(report.channelId, {
    skip: !showDialog,
    refetchOnFocus: false,
    refetchOnReconnect: false
  })

  const date = new Date(report.createdAt)
  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
    // timeZone: 'UTC', // или 'Europe/Moscow' для другого смещения
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date)

  const onHistoryHandle = useCallback(() => {
    setShowDialog(prev => !prev)
  }, [])

  const mediaUrl = report.recordUrl || ''
  const duration = report.duration ? formatTime(report.duration, t) : ''
  const isMobile = useMediaQuery('(max-width:800px)')

  const viewMode = isMobile ? 'SMALL' : cls.BIG

  return (
    <>
      <tr className={classNames(cls.ReportTableItem, {}, [className, viewMode])}>
        <td className={cls.tdCheck}>
          <Check
            key={report.id}
            className={classNames('', {
              [cls.uncheck]: !checkedItems?.includes(String(report.id)),
              [cls.check]: checkedItems?.includes(String(report.id))
            }, [])}
            value={report.id}
            size={'small'}
            checked={checkedItems?.includes(String(report.id))}
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
          {report.tokens ? <Text text={String(report.tokens)} /> : ''}
        </td>
        <td data-label={t('Стоимость')}>
          {report.cost ? <Text text={formatCurrency(report.cost, userCurrency, 4)} bold /> : ''}
        </td>
        <td className={cls.actionsTd}>
          <Button
            variant={'clear'}
            addonRight={
              showDialog
                ? <ExpandLessIcon fontSize={'large'} />
                : <ExpandMoreIcon fontSize={'large'} />
            }
            onClick={onHistoryHandle}
          />
        </td>
      </tr>
      {showDialog && (
        <tr className={cls.DialogRow}>
          <td colSpan={8}>
            <ReportShowDialog
              Dialogs={Dialogs}
              isDialogLoading={isDialogLoading}
              isDialogError={isDialogError}
              mediaUrl={mediaUrl}
            />
          </td>
        </tr>
      )}
    </>
  )
}
)
