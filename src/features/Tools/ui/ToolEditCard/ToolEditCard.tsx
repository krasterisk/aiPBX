import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolEditCard.module.scss'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { Tool, useTool } from '@/entities/Tools'
import { Input } from '@/shared/ui/redesigned/Input'
import { ToolEditCardHeader } from '../ToolEditCardHeader/ToolEditCardHeader'

interface UserEditCardProps {
  className?: string
  isError?: boolean
  onEdit?: (data: Tool) => void
  toolId?: string
  error?: FetchBaseQueryError | SerializedError | undefined
  onDelete?: (id: string) => void
}

export const ToolEditCard = memo((props: UserEditCardProps) => {
  const {
    className,
    onEdit,
    toolId,
    onDelete
  } = props

  const { data, isError, isLoading } = useTool(toolId!, {
    skip: !toolId
  })

  const initTool: Tool = {
    id: '',
    name: '',
    userId: '',
    comment: ''
  }

  const [formFields, setFormFields] = useState<Tool>(initTool)

  const { t } = useTranslation('tools')

  const editTextChangeHandler = (field: keyof Tool) =>
    (value: string) => {
      setFormFields({
        ...formFields,
        [field]: value
      })
    }

  const editHandler = useCallback(() => {
    onEdit?.(formFields)
  }, [formFields, onEdit])

  useEffect(() => {
    if (data) {
      setFormFields(data)
    }
  }, [data])

  if (isError) {
    return (
        <ErrorGetData/>
    )
  }

  if (isLoading) {
    return (
        <VStack gap={'16'} max>
          <Card max>
            <Skeleton width='100%' border='8px' height='44px'/>
          </Card>
          <Skeleton width='100%' border='8px' height='80px'/>
          <Skeleton width='100%' border='8px' height='80px'/>
          <Skeleton width='100%' border='8px' height='80px'/>
        </VStack>
    )
  }

  return (
      <VStack
          gap={'8'}
          max
          className={classNames(cls.ToolEditCard, {}, [className])}
      >
        <ToolEditCardHeader
            onEdit={editHandler}
            onDelete={onDelete}
            toolId={toolId}
        />
        <Card
            max
            padding={'8'}
            border={'partial'}
        >
          <VStack
              gap={'8'}
              max
          >
            <Input
                label={t('Наименование функции') ?? ''}
                onChange={editTextChangeHandler('name')}
                data-testid={'ToolCardCreate.name'}
                value={formFields.name}
            />
            <Input
                label={t('Комментарий') ?? ''}
                onChange={editTextChangeHandler('comment')}
                data-testid={'ToolCardCreate.comment'}
                value={formFields.comment}
            />
          </VStack>
        </Card>
      </VStack>
  )
})
