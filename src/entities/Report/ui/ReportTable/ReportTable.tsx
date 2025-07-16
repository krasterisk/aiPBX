import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportTable.module.scss'
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
import { Loader } from '@/shared/ui/Loader'
import { Divider } from '@/shared/ui/Divider'

interface ReportTableProps {
  className?: string
  report: Report
  view?: ContentView
  target?: HTMLAttributeAnchorTarget
  checkedItems?: string[]
  onChangeChecked?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const ReportTable = memo((props: ReportTableProps) => {
  const {
    className,
    report,
    view = 'SMALL',
    checkedItems,
    onChangeChecked
  } = props

  const { t } = useTranslation('')

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

  return (
            <>
                <tr className={classNames(cls.ReportTableItem, {}, [className, cls[view]])}>
                    <td className={cls.tdCheck}>
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
                    </td>
                    <td>
                        {report.createdAt ? <Text text={formattedDate}/> : ''}
                    </td>
                    <td>
                        {report.assistantName ? <Text text={report.assistantName}/> : ''}
                    </td>
                    <td>
                        {report.callerId ? <Text text={report.callerId}/> : ''}
                    </td>
                    <td>
                        {report.duration ? <Text text={String(report.duration)}/> : ''}
                    </td>
                    <td>
                        {report.tokens ? <Text text={String(report.tokens)}/> : ''}
                    </td>
                    <td>
                        <Button
                            variant={'clear'}
                            addonRight={
                                showDialog
                                  ? <ExpandLessIcon fontSize={'large'}/>
                                  : <ExpandMoreIcon fontSize={'large'}/>
                            }
                            onClick={onHistoryHandle}
                        />
                    </td>
                </tr>
                {showDialog && (
                    <tr>
                        <td colSpan={7}>
                            <VStack gap="24" className={cls.eventsContainer} wrap={'wrap'}>
                                <Divider/>

                                {isDialogLoading &&
                                    <HStack max justify={'center'}>
                                        <Loader/>
                                    </HStack>
                                }
                                {isDialogError &&
                                    <HStack max justify={'center'}>
                                        <Text text={t('Ошибка при загрузке диалога')} variant="error"/>
                                    </HStack>
                                }
                                {Dialogs?.length === 0 &&
                                    <HStack max justify={'center'}>
                                        <Text text={t('Диалог отсутствует')}/>
                                    </HStack>
                                }

                                {Dialogs?.map((dialog, index) => (
                                    <HStack
                                        key={index}
                                        gap={'16'}
                                        justify={'between'} max
                                    >

                                        <VStack
                                            gap={'4'}
                                            justify={'start'}
                                        >
                                            <Text
                                                text={dialog.timestamp}
                                            />
                                            <Text
                                                text={dialog.role}
                                                variant={dialog.role === 'User' ? 'accent' : 'success'}
                                                size={'m'}
                                            />
                                        </VStack>

                                        <Card border={'partial'}
                                              variant={dialog.role === 'User' ? 'outlined' : 'success'}>
                                            <Text text={dialog.text}/>
                                        </Card>
                                    </HStack>
                                ))}
                            </VStack>
                        </td>
                    </tr>
                )}
            </>
  )
}
)
