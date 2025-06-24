import { classNames } from '@/shared/lib/classNames/classNames'
import { memo, useCallback } from 'react'
import { TabItem, Tabs } from '@/shared/ui/redesigned/Tabs'
import { useTranslation } from 'react-i18next'

interface PeriodTabsProps {
  className?: string
  tab: string
  onChangeTab: (tab: string) => void
}

export const PeriodTabs = memo((props: PeriodTabsProps) => {
  const {
    className,
    tab,
    onChangeTab
  } = props

  const { t } = useTranslation('reports')

  const periodTabs: TabItem[] = [
    {
      value: 'day',
      content: t('День')
    },
    {
      value: 'week',
      content: t('Неделя')
    },
    {
      value: 'month',
      content: t('Месяц')
    },
    // {
    //   value: 'quarter',
    //   content: t('Квартал')
    // },
    {
      value: 'year',
      content: t('Год')
    }
  ]

  const onTabClick = useCallback((tab: TabItem) => {
    onChangeTab(tab.value)
  }, [onChangeTab])

  return (
        <Tabs
            direction={'row'}
            data-testid={'PeriodFiltersTabs'}
            className={classNames('', {}, [className])}
            tabs={periodTabs}
            onTabClick={onTabClick}
            value={tab}
        />
  )
})
