import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportList.module.scss'
import React, { useCallback, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { GroupedReport, ReportsListProps } from '../../model/types/report'
import { ErrorGetData } from '../../../ErrorGetData'
import { ContentView, ContentListItemSkeleton } from '../../../Content'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { ReportItem } from '../ReportItem/ReportItem'
import { Card } from '@/shared/ui/redesigned/Card'
import { Check } from '@/shared/ui/mui/Check'
import { Button } from '@/shared/ui/redesigned/Button'
import { ReportsListHeader } from '../ReportListHeader/ReportListHeader'
import { useGroupedReportsByChannelId } from '../../hooks/useOpenAiGroupedEvents'

export const ReportList = (props: ReportsListProps) => {
  const {
    className,
    isReportsError,
    isReportsLoading,
    reports,
    target,
    view = 'BIG'
  } = props

  const { t } = useTranslation('reports')

  const [checkedBox, setCheckedBox] = useState<string[]>([])
  const [indeterminateBox, setIndeterminateBox] = useState<boolean>(false)

  const groupedReports: GroupedReport[] = useGroupedReportsByChannelId(reports?.rows)

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
      if (groupedReports.length) {
        setIndeterminateBox(newChecked.length > 0 && newChecked.length < groupedReports?.length)
      }
      return newChecked
    })
  }

  const handleCheckAll = useCallback(() => {
    if (indeterminateBox && groupedReports?.length && checkedBox.length > 0) {
      setCheckedBox(groupedReports.map(report => String(report.channelId)))
      setIndeterminateBox(false)
    }

    if (!indeterminateBox && groupedReports?.length && checkedBox.length === 0) {
      setCheckedBox(groupedReports.map(report => String(report.channelId)))
      setIndeterminateBox(false)
    }

    if (!indeterminateBox && checkedBox.length > 0) {
      setCheckedBox([])
    }
  }, [checkedBox.length, groupedReports, indeterminateBox])

  const getSkeletons = (view: ContentView) => {
    return new Array(view === 'SMALL' ? 9 : 4)
      .fill(0)
      .map((item, index) => (
                <ContentListItemSkeleton className={cls.card} key={index} view={view}/>
      ))
  }

  if (isReportsError) {
    return (
            <ErrorGetData/>
    )
  }

  const checkedButtons = (
        <HStack
            gap={'16'}
            wrap={'wrap'}
            className={classNames('', {
              [cls.uncheckButtons]: checkedBox.length === 0,
              [cls.checkButtons]: checkedBox.length > 0
            }, [])}
        >
            <Button
                variant={'clear'}
            >
                <Text text={t('Выгрузить в Excel')} variant={'accent'}/>
            </Button>
        </HStack>
  )

  const renderContent = (report: GroupedReport) => {
    return (
            <ReportItem
                key={report.channelId}
                report={report}
                checkedItems={checkedBox}
                onChangeChecked={handleCheckChange}
                view={view}
                target={target}
                className={cls.caskItem}
            />
    )
  }

  return (
        <VStack gap={'16'} max>
            <ReportsListHeader />
            <Card max className={classNames(cls.ReportList, {}, [className])}>
                <HStack wrap={'nowrap'} justify={'end'} gap={'24'}>
                    <Check
                        className={classNames(cls.ReportsList, {
                          [cls.uncheck]: checkedBox.length === 0,
                          [cls.check]: checkedBox.length > 0
                        }, [])}
                        indeterminate={indeterminateBox}
                        checked={checkedBox.length === reports?.count}
                        onChange={handleCheckAll}
                    />
                    {checkedButtons}
                    {
                        checkedBox.length > 0
                          ? <Text text={t('Выбрано') + ': ' + String(checkedBox.length) + t(' из ') + String(groupedReports?.length)}/>
                          : <Text text={t('Всего') + ': ' + String(groupedReports.length || 0)}/>
                    }
                </HStack>
            </Card>

            {reports?.rows.length
              ? <HStack wrap={'wrap'} gap={'4'} align={'start'} max>
                    {groupedReports.map(renderContent)}
                </HStack>
              : <HStack
                    justify={'center'} max
                    className={classNames('', {}, [className, cls[view]])}
                >
                    <Text align={'center'} text={t('Данные не найдены')}/>
                </HStack>
            }
            {isReportsLoading && getSkeletons(view)}
        </VStack>
  )
}
