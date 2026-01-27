import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportListHeader.module.scss'
import React, { memo, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/redesigned/Input'
import { Icon } from '@/shared/ui/redesigned/Icon'
import SearchIcon from '@/shared/assets/icons/search.svg'
import { useReportFilters } from '../../lib/useReportFilters'
import { PeriodPicker } from '../../../PeriodPicker'
import { PeriodExtendedFilters } from '@/features/PeriodExtendedFilter'

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
  const isMobile = useMediaQuery('(max-width:800px)')

  const [filterShow, setFilterShow] = useState<boolean>(false)

  return (
    <VStack
      className={classNames(cls.ReportListHeader, { [cls.mobileHeader]: isMobile }, [className])}
      justify={'center'}
      align={'center'}
      max
      gap={'16'}
    >
      <Input
        data-testid={'ReportSearch'}
        className={cls.searchInput}
        placeholder={t('Поиск') ?? ''}
        size={'s'}
        onChange={onChangeSearch}
        addonLeft={<Icon Svg={SearchIcon} />}
        value={search}
      />
      <HStack gap={'8'} justify={'start'} wrap={'wrap'}>
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
          onChangeUserId={onChangeUserId}
          onOpenFilters={() => setFilterShow(true)}
        />
      </HStack>
    </VStack>
  )
})
