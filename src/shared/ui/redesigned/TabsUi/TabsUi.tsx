import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './TabsUi.module.scss'
import { memo, ReactNode, useCallback } from 'react'
import { Card } from '../Card'
import { Flex, FlexDirection, FlexWrap } from '../Stack/Flex/Flex'

export interface TabItem {
  value: string
  content: ReactNode
}

interface TabsProps {
  className?: string
  tabs: TabItem[]
  value: string
  onTabClick: (tab: TabItem) => void
  direction?: FlexDirection
  wrap?: FlexWrap
}

export const TabsUi = memo((props: TabsProps) => {
  const {
    className,
    tabs,
    value,
    onTabClick,
    direction = 'row',
    wrap = 'nowrap'
  } = props

  const onClickHandler = useCallback((tab: TabItem) => () => {
    onTabClick(tab)
  }, [onTabClick])

  return (
    <Flex
      direction={direction}
      wrap={wrap}
      gap='8'
      align={'start'}
      className={classNames(cls.Tabs, {}, [className])}
    >
      {tabs.map((tab) => {
        const isSelected = tab.value === value
        return (
          <Card
            variant={isSelected ? 'light' : 'clear'}
            className={classNames(cls.tab, { [cls.selected]: isSelected }, ['tab-item', isSelected ? 'tab-item-selected' : ''])}
            key={tab.value}
            padding="8"
            onClick={onClickHandler(tab)}
            border="partial"
          >
            {tab.content}
          </Card>
        )
      })}
    </Flex>
  )
})
