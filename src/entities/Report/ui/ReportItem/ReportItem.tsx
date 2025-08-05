import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportItem.module.scss'
import React, { HTMLAttributeAnchorTarget, memo, useCallback, useState } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { ContentView } from '@/entities/Content'
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

interface ReportItemProps {
  className?: string
  report: Report
  view?: ContentView
  target?: HTMLAttributeAnchorTarget
  checkedItems?: string[]
  onChangeChecked?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const ReportItem = memo((props: ReportItemProps) => {
  const {
    className,
    report,
    view = 'SMALL',
    checkedItems,
    onChangeChecked
  } = props

  const { t } = useTranslation('reports')
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
  const mediaUrl = __STATIC__ + 'audio_mixed_' + report.channelId + '.wav'
  const duration = report.duration ? formatTime(report.duration, t) : ''
  const formattedCost = report.cost ? parseFloat((report.cost || 0).toFixed(2)) : 0
  const isMobile = useMediaQuery('(max-width:800px)')
  const viewMode = isMobile ? 'MOBILE' : cls[view]

  return (
            <Card
                border={'partial'}
                variant={'outlined'}
                padding={'16'}
                max
                className={classNames(cls.ReportItem, {}, [className, viewMode])}
            >
                <Check
                    key={report.channelId}
                    className={classNames('', {
                      [cls.uncheck]: !checkedItems?.includes(report.channelId),
                      [cls.check]: checkedItems?.includes(report.channelId)
                    }, [])}
                    value={report.channelId}
                    size={'small'}
                    checked={checkedItems?.includes(report.channelId)}
                    onChange={onChangeChecked}
                />
                <VStack gap={'8'} wrap={'wrap'} justify={'between'} max>
                    {report.createdAt ? <Text text={formattedDate} bold/> : ''}
                    {report.assistantName ? <Text text={report.assistantName}/> : ''}
                    {report.callerId &&
                        <HStack gap={'8'} wrap={'wrap'}>
                            <Text text={t('Звонивший') + ':'} bold/>
                            <Text text={report.callerId}/>
                        </HStack>
                    }
                    {report.duration &&
                        <HStack gap={'8'} wrap={'wrap'}>
                            <Text text={t('Длительность') + ':'} bold/>
                            <Text text={String(duration)}/>
                        </HStack>
                    }

                    {report.tokens &&
                        <HStack gap={'8'} wrap={'wrap'}>
                            <Text text={t('Токены') + ':'} bold/>
                            <Text text={String(report.tokens)}/>
                        </HStack>
                    }
                    {formattedCost > 0 &&
                        <HStack gap={'8'} wrap={'wrap'}>
                            <Text text={t('Стоимость') + ':'} bold/>
                            <Text text={String(formattedCost)}/>
                        </HStack>
                    }
                    <HStack max justify={'end'}>
                        <Button
                            variant={'clear'}
                            addonRight={
                                showDialog
                                  ? <ExpandLessIcon fontSize={'large'}/>
                                  : <ExpandMoreIcon fontSize={'large'}/>
                            }
                            onClick={onHistoryHandle}
                        />
                    </HStack>
                </VStack>
                {showDialog &&
                    <ReportShowDialog
                        isDialogLoading={isDialogLoading}
                        isDialogError={isDialogError}
                        Dialogs={Dialogs}
                        mediaUrl={mediaUrl}
                    />
                }
            </Card>
  )
}
)
