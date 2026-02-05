import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportListHeader.module.scss'
import React, { memo, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useReportFilters } from '../../lib/useReportFilters'
import { PeriodPicker } from '../../../PeriodPicker'
import { PeriodExtendedFilters } from '@/features/PeriodExtendedFilter'
import { Text } from '@/shared/ui/redesigned/Text'
import { SearchInput } from '@/shared/ui/mui/SearchInput/SearchInput'

interface ReportsListHeaderProps {
  className?: string
}

export const ReportsListHeader = memo((props: ReportsListHeaderProps) => {
  const {
    className
  } = props

  const {
    tab,
    startDate,
    endDate,
    clientId,
    search,
    assistantId,
    isInited,
    onChangeAssistant,
    onChangeTab,
    onChangeUserId,
    onChangeStartDate,
    onChangeEndDate,
    onChangeSearch
  } = useReportFilters()

  const { t } = useTranslation('reports')
  const isMobile = useMediaQuery('(max-width:1024px)') // Adjusted tablet break

  const [filterShow, setFilterShow] = useState<boolean>(false)

  return (
    <VStack
      className={classNames(cls.ReportListHeader, {}, [className])}
      max
      gap="24"
    >
      <HStack max justify="between" align="center" gap="16" className={cls.headerContent}>
        <div className={cls.titleSection}>
          <Text title={t('Звонки')} size="l" bold />
        </div>

        <div className={cls.controlsSection}>
          <PeriodPicker
            className={cls.datePicker}
            userId={clientId}
            onChangeTab={onChangeTab}
            tab={tab}
            isInited={isInited}
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={onChangeStartDate}
            onChangeEndDate={onChangeEndDate}
            onOpenFilters={() => setFilterShow(true)}
          />

          <SearchInput
            className={cls.searchInput}
            placeholder={t('Поиск по звонку...') ?? ''}
            onChange={onChangeSearch}
            value={search}
          />

          <PeriodExtendedFilters
            assistantId={assistantId}
            userId={clientId}
            startDate={startDate}
            endDate={endDate}
            onChangeUserId={onChangeUserId}
            onChangeAssistant={onChangeAssistant}
            onChangeStartDate={onChangeStartDate}
            onChangeEndDate={onChangeEndDate}
            show={filterShow}
            onClose={() => setFilterShow(false)}
          />
        </div>
      </HStack>
    </VStack>
  )
})
