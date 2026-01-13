import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './TabsUi.module.scss'
import { memo, ReactNode, useCallback } from 'react'
import { Card } from '../Card'
import { Flex, FlexDirection } from '../Stack/Flex/Flex'

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
}

export const TabsUi = memo((props: TabsProps) => {
  const {
    className,
    tabs,
    value,
    onTabClick,
    direction = 'row'
  } = props

  const onClickHandler = useCallback((tab: TabItem) => () => {
    onTabClick(tab)
  }, [onTabClick])

  return (
        <Flex
            direction={direction}
            gap='8'
            align={'start'}
            className={classNames(cls.Tabs, {}, [className])}
        >
            {tabs.map((tab) => {
              const isSelected = tab.value === value
              return (
                    <Card
                        variant={isSelected ? 'light' : 'normal'}
                        className={classNames(cls.tab, { [cls.selected]: isSelected })}
                        key={tab.value}
                        padding={isSelected ? '16' : '8'}
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
