import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolItem.module.scss'
import React, { HTMLAttributeAnchorTarget, memo } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { ContentView } from '@/entities/Content'
import { Check } from '@/shared/ui/mui/Check'
import { Tool } from '../../model/types/tools'
import { ToolMenu } from '../ToolMenu/ToolMenu'
import { getRouteToolsEdit } from '@/shared/const/router'
import { AppLink } from '@/shared/ui/redesigned/AppLink'

interface ToolItemProps {
  className?: string
  tool: Tool
  onEdit?: (id: string) => void
  view?: ContentView
  target?: HTMLAttributeAnchorTarget
  checkedItems?: string[]
  onChangeChecked?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const ToolItem = memo((props: ToolItemProps) => {
  const {
    className,
    tool,
    view = 'SMALL',
    checkedItems,
    onChangeChecked
  } = props

  if (view === 'BIG') {
    return (
      <Card
        padding={'16'}
        max
        border={'partial'}
        className={classNames(cls.ToolItem, {}, [className, cls[view]])}
      >
        <HStack gap={'24'} wrap={'wrap'} justify={'start'}>
          <Check
            key={String(tool.id)}
            className={classNames('', {
              [cls.uncheck]: !checkedItems?.includes(String(tool.id)),
              [cls.check]: checkedItems?.includes(String(tool.id))
            }, [])}
            value={String(tool.id)}
            size={'small'}
            checked={checkedItems?.includes(String(tool.id))}
            onChange={onChangeChecked}
          />
          <AppLink to={getRouteToolsEdit(tool.id || '')}>
            <VStack max>
              <Text title={tool.name} />
              {tool.comment ? <HStack><Text text={tool.comment} /></HStack> : ''}
            </VStack>
          </AppLink>
        </HStack>
        {/* <ToolMenu id={tool.id || ''} className={cls.menu} /> */}
      </Card>
    )
  }

  return (
    <Card
      padding={'24'}
      border={'partial'}
      className={classNames(cls.ToolItem, {}, [className, cls[view]])}
    >
      <VStack
        gap={'8'}
        justify={'start'}
      >

        <Check
          key={String(tool.id)}
          className={classNames('', {
            [cls.uncheck]: !checkedItems?.includes(String(tool.id)),
            [cls.check]: checkedItems?.includes(String(tool.id))
          }, [])}
          value={String(tool.id)}
          size={'small'}
          checked={checkedItems?.includes(String(tool.id))}
          onChange={onChangeChecked}
        />
        <AppLink to={getRouteToolsEdit(tool.id || '')}>
          <Text title={tool.name} />
          {tool.comment ? <HStack><Text text={tool.comment} /></HStack> : ''}
        </AppLink>
      </VStack>
      <ToolMenu id={tool?.id || ''} className={cls.menu} />
    </Card>
  )
}
)
