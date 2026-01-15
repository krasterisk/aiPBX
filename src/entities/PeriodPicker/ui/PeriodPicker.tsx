import React, { memo, useEffect, useState } from 'react'
import dayjs, { Dayjs, ManipulateType, OpUnitType } from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import updateLocale from 'dayjs/plugin/updateLocale'
import Left from '@/shared/assets/icons/left.svg'
import Right from '@/shared/assets/icons/right.svg'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { PeriodTabs } from '@/entities/Filters'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import { ClientOptions } from '@/entities/User'
import TuneIcon from '@mui/icons-material/Tune'

// Расширяем Day.js плагинами weekday и updateLocale
dayjs.extend(weekday)
dayjs.extend(updateLocale)
dayjs.extend(quarterOfYear)

dayjs.updateLocale('en', {
  weekStart: 1 // 0 - воскресенье, 1 - понедельник, и так далее
})

interface PeriodPickerProps {
  className?: string
  tab?: string
  userId?: string
  startDate?: string
  endDate?: string
  isInited?: boolean
  onOpenFilters?: () => void
  onChangeTab: (tab: string) => void
  onChangeStartDate: (value: string) => void
  onChangeEndDate: (value: string) => void
  onChangeUserId: (event: any, user: ClientOptions) => void
}

export const PeriodPicker = memo((props: PeriodPickerProps) => {
  const {
    tab = 'week',
    userId,
    startDate,
    endDate,
    isInited,
    onOpenFilters,
    onChangeTab,
    onChangeEndDate,
    onChangeStartDate,
    onChangeUserId
  } = props

  const [date, setDate] = useState<Dayjs>(dayjs())

  // Sync internal state with props
  useEffect(() => {
    if (startDate) {
      const d = dayjs(startDate)
      if (!d.isSame(date, 'day')) {
        setDate(d)
      }
    }
  }, [startDate])

  // Handle Tab change logic
  useEffect(() => {
    if (isInited) {
      const start = dayjs(date).startOf(tab as OpUnitType).format('YYYY-MM-DD')
      const end = dayjs(date).endOf(tab as OpUnitType).format('YYYY-MM-DD')

      // Only invoke callback if values are different to avoid loops if parent passes them back
      // Using simple string check assumes format consistency
      if (start !== startDate || end !== endDate) {
        onChangeStartDate(start)
        onChangeEndDate(end)
      }
    }
  }, [isInited, tab]) // Removed date, startDate, endDate from dependencies

  const handleDateChange = (direction: 'left' | 'right') => {
    const newDate = dayjs(date).add(direction === 'right' ? 1 : -1, tab as ManipulateType)
    setDate(newDate)
    const start = dayjs(newDate).startOf(tab as OpUnitType).format('YYYY-MM-DD')
    const end = dayjs(newDate).endOf(tab as OpUnitType).format('YYYY-MM-DD')
    onChangeStartDate(start)
    onChangeEndDate(end)
  }

  return (
    <VStack gap={'16'} align={'center'}>
      <HStack gap={'16'}>
        <PeriodTabs tab={tab} onChangeTab={onChangeTab} />
        {onOpenFilters && (
          <Button variant={'clear'} onClick={onOpenFilters}>
            <TuneIcon fontSize={'large'} />
          </Button>
        )}
      </HStack>
      <HStack gap={'8'}>
        <Button
          variant={'clear'}
          onClick={() => {
            handleDateChange('left')
          }}
        >
          <Icon Svg={Left} width={16} height={16} />
        </Button>
        <Text
          data-testid={'PeriodPicker.period'}
          text={String(startDate) + ' - ' + String(endDate)}
        />
        <Button
          variant={'clear'}
          onClick={() => {
            handleDateChange('right')
          }}
        >
          <Icon Svg={Right} width={16} height={16} />
        </Button>
      </HStack>
    </VStack>
  )
})
