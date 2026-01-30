import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolItem.module.scss'
import React, { HTMLAttributeAnchorTarget, memo, useCallback } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { ContentView } from '@/entities/Content'
import { Check } from '@/shared/ui/mui/Check'
import { Tool } from '../../model/types/tools'
import { getRouteToolsEdit } from '@/shared/const/router'
import { useNavigate } from 'react-router-dom'

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

  const navigate = useNavigate()

  const onOpenEdit = useCallback(() => {
    navigate(getRouteToolsEdit(tool.id || ''))
  }, [tool.id, navigate])

  const onCheckClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  if (view === 'BIG') {
    return (
      <Card
        padding={'16'}
        max
        border={'partial'}
        className={classNames(cls.ToolItem, {}, [className, cls[view]])}
        onClick={onOpenEdit}
      >
        <HStack gap={'24'} wrap={'wrap'} justify={'start'}>
          <div onClick={onCheckClick}>
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
          </div>
          <VStack max>
            <Text title={tool.name} />
            {tool.comment ? <HStack><Text text={tool.comment} /></HStack> : ''}
          </VStack>
        </HStack>
      </Card>
    )
  }

  return (
    <Card
      padding={'24'}
      border={'partial'}
      className={classNames(cls.ToolItem, {}, [className, cls[view]])}
      onClick={onOpenEdit}
    >
      <VStack
        gap={'8'}
        justify={'start'}
      >
        <div onClick={onCheckClick}>
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
        </div>
        <VStack gap={'4'}>
          <Text title={tool.name} />
          {tool.comment ? <HStack><Text text={tool.comment} /></HStack> : ''}
        </VStack>
      </VStack>
    </Card>
  )
})
