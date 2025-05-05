import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportItem.module.scss'
import React, { HTMLAttributeAnchorTarget, memo, useState } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { ContentView } from '@/entities/Content'
import { Check } from '@/shared/ui/mui/Check'
import { GroupedReport } from '../../model/types/report'

interface ReportItemProps {
  className?: string
  report: GroupedReport
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

  const [showEvents, setShowEvents] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [expandedEventIds, setExpandedEventIds] = useState<Record<string, boolean>>({})

  if (view === 'BIG') {
    return (
                <Card
                    padding={'8'}
                    max
                    className={classNames(cls.ReportItem, {}, [className, cls[view]])}
                >
                    <HStack gap={'24'} wrap={'wrap'} justify={'start'}>
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

                        {report.createdAt ? <Text text={report.createdAt}/> : ''}
                        {report.callerId ? <Text text={report.callerId}/> : ''}
                        {report.event ? <Text text={JSON.stringify(report.event)}/> : ''}

                    </HStack>
                </Card>
    )
  }

  return (
            <Card
                padding={'24'}
                border={'partial'}
                className={classNames(cls.ReportItem, {}, [className, cls[view]])}
            >
                <VStack
                    gap={'8'}
                    justify={'start'}
                >

                    <Check
                        key={String(report.id)}
                        className={classNames('', {
                          [cls.uncheck]: !checkedItems?.includes(String(report.id)),
                          [cls.check]: checkedItems?.includes(String(report.id))
                        }, [])}
                        value={String(report.id)}
                        size={'small'}
                        checked={checkedItems?.includes(String(report.id))}
                        onChange={onChangeChecked}
                    />
                    {report.createdAt ? <Text text={report.createdAt}/> : ''}
                    {report.callerId ? <Text text={report.callerId}/> : ''}
                    {report.event ? <Text text={JSON.stringify(report.event)}/> : ''}
                </VStack>
            </Card>
  )
}
)
