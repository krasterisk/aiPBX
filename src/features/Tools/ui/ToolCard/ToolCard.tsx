import React, { memo } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { ToolForm } from '../ToolForm/ToolForm'
import { HStack } from '@/shared/ui/redesigned/Stack'

export interface ToolCardProps {
  className?: string
  isEdit?: boolean
  toolId?: string
}

export const ToolCard = memo((props: ToolCardProps) => {
  const {
    className,
    isEdit,
    toolId
  } = props

  return (
    <HStack max className={classNames('', {}, [className])}>
      <ToolForm isEdit={isEdit} toolId={toolId} />
    </HStack>
  )
})
