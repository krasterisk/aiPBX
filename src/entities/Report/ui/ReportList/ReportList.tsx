import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportList.module.scss'
import React, { useCallback, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Report, ReportsListProps } from '../../model/types/report'
import { ErrorGetData } from '../../../ErrorGetData'
import { ContentView, ContentListItemSkeleton } from '../../../Content'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { ReportItem } from '../ReportItem/ReportItem'
import { Card } from '@/shared/ui/redesigned/Card'
import { Check } from '@/shared/ui/mui/Check'
import { Button } from '@/shared/ui/redesigned/Button'
import { ReportsListHeader } from '../ReportListHeader/ReportListHeader'
import { ReportTable } from '../ReportTable/ReportTable'

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
      if (reports?.count) {
        setIndeterminateBox(newChecked.length > 0 && newChecked.length < reports?.count)
      }
      return newChecked
    })
  }

  const handleHistoryShow = useCallback((channelId: string) => {

  }, [])

  const handleCheckAll = useCallback(() => {
    if (indeterminateBox && reports?.count && checkedBox.length > 0) {
      setCheckedBox(reports.rows.map(report => String(report.id)))
      setIndeterminateBox(false)
    }

    if (!indeterminateBox && reports?.count && checkedBox.length === 0) {
      setCheckedBox(reports.rows.map(report => String(report.id)))
      setIndeterminateBox(false)
    }

    if (!indeterminateBox && checkedBox.length > 0) {
      setCheckedBox([])
    }
  }, [checkedBox.length, reports, indeterminateBox])

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

  const renderContent = (report: Report) => {
    return (
            <ReportItem
                key={report.id}
                report={report}
                checkedItems={checkedBox}
                onChangeChecked={handleCheckChange}
                view={view}
                target={target}
                className={cls.reportItem}
            />
    )
  }

  const renderTableContent = (report: Report) => {
    return (
            <ReportTable
                key={report.id}
                report={report}
                checkedItems={checkedBox}
                onChangeChecked={handleCheckChange}
                view={view}
                target={target}
                className={cls.TableItem}
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
                          ? <Text text={t('Выбрано') + ': ' + String(checkedBox.length) + t(' из ') + String(reports?.count)}/>
                          : <Text text={t('Всего') + ': ' + String(reports?.count || 0)}/>
                    }
                </HStack>
            </Card>

            {reports?.rows.length
              ? <table className={cls.Table}>
                <thead className={cls.TableHeader}>
                <tr>
                    <th className={cls.tdCheck}></th>
                    <th>{t('Дата')}</th>
                    <th>{t('Ассистент')}</th>
                    <th>{t('Звонивший')}</th>
                    <th>{t('Длительность')}</th>
                    <th>{t('Токены')}</th>
                    <th>{t('Стоимость')}</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {reports.rows.map(renderTableContent)}
                </tbody>
                </table>

            // <HStack wrap={'wrap'} gap={'4'} align={'start'} max>
            //     {reports.rows.map(renderContent)}
            // </HStack>
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
