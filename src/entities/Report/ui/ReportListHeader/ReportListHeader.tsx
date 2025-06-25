import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportListHeader.module.scss'
import React, { memo } from 'react'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { useMediaQuery } from '@mui/material'
import { ContentViewSelector } from '../../../Content'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/redesigned/Input'
import { Icon } from '@/shared/ui/redesigned/Icon'
import SearchIcon from '@/shared/assets/icons/search.svg'
import { useReportFilters } from '../../lib/useReportFilters'
import { PeriodPicker } from '../../../PeriodPicker'
import { ClientSelect, isUserAdmin } from '@/entities/User'
import { useSelector } from 'react-redux'
import { AssistantSelect } from '@/entities/Assistants'

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
    view,
    isInited,
    onChangeAssistant,
    onChangeTab,
    onChangeUserId,
    onChangeStartDate,
    onChangeEndDate,
    onChangeSearch,
    onChangeView
  } = useReportFilters()

  const { t } = useTranslation('reports')
  const isMobile = useMediaQuery('(max-width:800px)')
  const isAdmin = useSelector(isUserAdmin)

  return (
        <HStack
            className={classNames(cls.ReportListHeader, { [cls.mobileHeader]: isMobile }, [className])}
            justify={'between'}
            max
        >
            <HStack gap={'8'} justify={'start'} wrap={'wrap'}>
                <ContentViewSelector view={view} onViewClick={onChangeView}/>
                <Input
                    data-testid={'ReportSearch'}
                    className={cls.searchInput}
                    placeholder={t('Поиск') ?? ''}
                    size={'s'}
                    onChange={onChangeSearch}
                    addonLeft={<Icon Svg={SearchIcon}/>}
                    value={search}
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
                    onChangeUserId={onChangeTab}
                />
                <AssistantSelect
                    label={t('Ассистент') || ''}
                    assistantId={assistantId}
                    onChangeAssistant={onChangeAssistant}
                />
                {isAdmin &&
                    <ClientSelect
                        label={t('Клиент') || ''}
                        clientId={clientId}
                        onChangeClient={onChangeUserId}
                    />
                }
            </HStack>
        </HStack>
  )
})
