import React, { memo, useCallback, useEffect, useState } from 'react'
import dayjs, { Dayjs, ManipulateType, OpUnitType } from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import updateLocale from 'dayjs/plugin/updateLocale'
import Left from '@/shared/assets/icons/left.svg'
import Right from '@/shared/assets/icons/right.svg'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Input } from '@/shared/ui/redesigned/Input'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { PeriodTabs } from '@/entities/Filters'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import TuneIcon from '@mui/icons-material/Tune'
import { PeriodExtendedFilters } from '../PeriodExtendedFilter/PeriodExtendedFilter'
import { ClientOptions } from '@/entities/User'
import { AssistantOptions } from '@/entities/Assistants'

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
  assistantId?: string[]
  startDate?: string
  endDate?: string
  isInited?: boolean
  onChangeTab: (tab: string) => void
  onChangeStartDate: (value: string) => void
  onChangeEndDate: (value: string) => void
  onChangeAssistant: (event: any, assistant: AssistantOptions[]) => void
  onChangeUserId: (event: any, user: ClientOptions) => void
}

export const PeriodPicker = memo((props: PeriodPickerProps) => {
  const {
    tab = 'week',
    userId,
    assistantId,
    startDate,
    endDate,
    isInited,
    onChangeTab,
    onChangeEndDate,
    onChangeStartDate,
    onChangeAssistant,
    onChangeUserId
  } = props

  const [date, setDate] = useState<Dayjs>(dayjs())
  const [filterShow, setFilterShow] = useState<boolean>(false)

  useEffect(() => {
    if (isInited) {
      const start = dayjs(date).startOf(tab as OpUnitType).format('YYYY-MM-DD')
      const end = dayjs(date).endOf(tab as OpUnitType).format('YYYY-MM-DD')
      onChangeStartDate(start)
      onChangeEndDate(end)
    }
  }, [date, isInited, onChangeEndDate, onChangeStartDate, tab])

  const handleDateChange = (direction: 'left' | 'right') => {
    const newDate = dayjs(date).add(direction === 'right' ? 1 : -1, tab as ManipulateType)
    setDate(newDate)
  }

  const handlerChangeDate = useCallback(() => {
    const startDate = dayjs(date).startOf(tab as OpUnitType).format('YYYY-MM-DD')
    const endDate = dayjs(date).endOf(tab as OpUnitType).format('YYYY-MM-DD')
    onChangeStartDate(startDate)
    onChangeEndDate(endDate)
  }, [date, onChangeEndDate, onChangeStartDate, tab])

  return (
        <VStack gap={'16'}>
            <HStack gap={'8'} wrap={'nowrap'}>
                <PeriodExtendedFilters
                    assistantId={assistantId}
                    userId={userId}
                    startDate={startDate}
                    endDate={endDate}
                    onChangeUserId={onChangeUserId}
                    onChangeAssistant={onChangeAssistant}
                    onChangeStartDate={onChangeStartDate}
                    onChangeEndDate={onChangeEndDate}
                    show={filterShow} onClose={() => {
                      setFilterShow(false)
                    }}/>
                <PeriodTabs tab={tab} onChangeTab={onChangeTab} />
                <Button variant={'clear'} onClick={() => {
                  setFilterShow(true)
                }}>
                    <TuneIcon fontSize={'large'} />
                </Button>
            </HStack>
            <HStack gap={'8'} max>
                <Button
                    variant={'clear'}
                    onClick={() => {
                      handleDateChange('left')
                    }}
                >
                    <Icon Svg={Left} width={16} height={16}/>
                </Button>
                <Input
                    readonly
                    data-testid={'PeriodPicker.period'}
                    onChange={handlerChangeDate}
                    value={String(startDate) + ' - ' + String(endDate)}
                />
                <Button
                    variant={'clear'}
                    onClick={() => {
                      handleDateChange('right')
                    }}
                >
                    <Icon Svg={Right} width={16} height={16}/>
                </Button>
            </HStack>
        </VStack>
  )
})
