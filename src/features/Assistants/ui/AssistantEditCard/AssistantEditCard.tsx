import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantEditCard.module.scss'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { Assistant, useAssistant } from '@/entities/Assistants'
import { Input } from '@/shared/ui/redesigned/Input'
import { AssistantEditCardHeader } from '../AssistantEditCardHeader/AssistantEditCardHeader'

interface UserEditCardProps {
  className?: string
  isError?: boolean
  onEdit?: (data: Assistant) => void
  assistantId?: string
  error?: FetchBaseQueryError | SerializedError | undefined
  onDelete?: (id: string) => void
}

export const AssistantEditCard = memo((props: UserEditCardProps) => {
  const {
    className,
    onEdit,
    assistantId,
    onDelete
  } = props

  const { data, isError, isLoading } = useAssistant(assistantId!, {
    skip: !assistantId
  })

  const initAssistant = {
    id: '',
    name: '',
    comment: ''
  }
  const [formFields, setFormFields] = useState<Assistant>(initAssistant)

  const { t } = useTranslation('assistants')

  const editTextChangeHandler = (field: keyof Assistant) =>
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
          className={classNames(cls.AssistantEditCard, {}, [className])}
      >
        <AssistantEditCardHeader
            onEdit={editHandler}
            onDelete={onDelete}
            assistantId={assistantId}
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
                label={t('Наименование ассистента') ?? ''}
                onChange={editTextChangeHandler('name')}
                data-testid={'AssistantCardCreate.name'}
                value={formFields.name}
            />
            <Input
                label={t('Комментарий') ?? ''}
                onChange={editTextChangeHandler('comment')}
                data-testid={'AssistantCardCreate.comment'}
                value={formFields.comment}
            />
          </VStack>
        </Card>
      </VStack>
  )
})
