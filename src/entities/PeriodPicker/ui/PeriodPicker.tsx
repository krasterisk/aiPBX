import React, { memo, useEffect, useState } from 'react'
import dayjs, { Dayjs, ManipulateType, OpUnitType } from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import updateLocale from 'dayjs/plugin/updateLocale'
import Left from '@/shared/assets/icons/left.svg'
import Right from '@/shared/assets/icons/right.svg'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { PeriodTabs } from '@/entities/Filters'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import TuneIcon from '@mui/icons-material/Tune'
import cls from './PeriodPicker.module.scss'
import { classNames } from '@/shared/lib/classNames/classNames'
import { useMediaQuery } from '@mui/material'

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
}

export const PeriodPicker = memo((props: PeriodPickerProps) => {
  const {
    className,
    tab = 'week',
    userId,
    startDate,
    endDate,
    isInited,
    onOpenFilters,
    onChangeTab,
    onChangeEndDate,
    onChangeStartDate,
  } = props

  const [date, setDate] = useState<Dayjs>(dayjs())
  const isMobile = useMediaQuery('(max-width:800px)')

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

      if (start !== startDate || end !== endDate) {
        onChangeStartDate(start)
        onChangeEndDate(end)
      }
    }
  }, [isInited, tab])

  const handleDateChange = (direction: 'left' | 'right') => {
    const newDate = dayjs(date).add(direction === 'right' ? 1 : -1, tab as ManipulateType)
    setDate(newDate)
    const start = dayjs(newDate).startOf(tab as OpUnitType).format('YYYY-MM-DD')
    const end = dayjs(newDate).endOf(tab as OpUnitType).format('YYYY-MM-DD')
    onChangeStartDate(start)
    onChangeEndDate(end)
  }

  const content = (
    <HStack gap="8" align="center" wrap={isMobile ? 'wrap' : 'nowrap'} className={classNames(cls.PeriodPicker, {}, [className])}>
      <PeriodTabs
        tab={tab}
        onChangeTab={onChangeTab}
        className="PeriodFiltersTabs"
      />

      {!isMobile && <div className={cls.divider} />}

      <HStack gap="4" align="center" wrap='nowrap'>
        <Button
          variant="clear"
          className={cls.navBtn}
          onClick={() => handleDateChange('left')}
        >
          <Icon Svg={Left} width={18} height={18} />
        </Button>

        <Text
          data-testid="PeriodPicker.period"
          text={`${startDate} - ${endDate}`}
          className={cls.dateDisplay}
          size="s"
        />

        <Button
          variant="clear"
          className={cls.navBtn}
          onClick={() => handleDateChange('right')}
        >
          <Icon Svg={Right} width={18} height={18} />
        </Button>

        {onOpenFilters && (
          <>
            {!isMobile && <div className={cls.divider} />}
            <Button variant="clear" onClick={onOpenFilters} className={cls.tuneBtn}>
              <TuneIcon />
            </Button>
          </>

        )}
      </HStack>
    </HStack>
  )

  return content
})
