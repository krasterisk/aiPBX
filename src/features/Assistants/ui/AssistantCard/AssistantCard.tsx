import React, { memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRouteAssistants } from '@/shared/const/router'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantCard.module.scss'

import {
  useDeleteAssistant,
  useSetAssistants,
  useUpdateAssistant,
  Assistant,
  assistantFormReducer
, getAssistantFormData 
} from '@/entities/Assistants'

import { AssistantForm } from '../AssistantForm'
import { AssistantFormHeader } from '../AssistantFormHeader'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useSelector } from 'react-redux'

export interface AssistantCardProps {
  className?: string
  error?: string
  isLoading?: boolean
  readonly?: boolean
  isEdit: boolean
  assistantId?: string
}

export const AssistantCard = memo((props: AssistantCardProps) => {
  const {
    className,
    isLoading,
    isEdit,
    assistantId
  } = props

  const [assistantCreate, { isError, error }] = useSetAssistants()
  const [assistantUpdate] = useUpdateAssistant()
  const [assistantDelete] = useDeleteAssistant()

  const navigate = useNavigate()
  const { t } = useTranslation('assistants')
  const formFields = useSelector(getAssistantFormData)

  const reducers: ReducersList = {
    assistantForm: assistantFormReducer
  }

  const handleCreateAssistant = useCallback((data: Assistant) => {
    assistantCreate([data])
      .unwrap()
      .then(() => {
        navigate(getRouteAssistants())
      })
      .catch(() => {
        // Error toast handled by global toastMiddleware
      })
  }, [assistantCreate, navigate])

  const validateAssistant = useCallback((data: Assistant) => {
    if (!data.name || !data.model || !data.voice || !data.instruction) {
      toast.error(t('Проверьте заполняемые поля и повторите ещё раз'))
      return false
    }
    return true
  }, [t])

  const onCreate = useCallback(() => {
    if (!formFields) return
    if (!validateAssistant(formFields)) return
    handleCreateAssistant(formFields)
  }, [formFields, handleCreateAssistant, validateAssistant])

  const handleEditAssistant = useCallback((data: Assistant) => {
    assistantUpdate(data)
      .unwrap()
      .then(() => {
        toast.success(t('Сохранено успешно'))
      })
      .catch(() => {
        // Error toast handled by global toastMiddleware
      })
  }, [assistantUpdate, t])

  const handleDeleteAssistant = useCallback((id: string) => {
    assistantDelete(id)
      .unwrap()
      .then(() => {
        navigate(getRouteAssistants())
      })
      .catch(() => {
        // Error toast handled by global toastMiddleware
      })
  }, [assistantDelete, navigate])

  const onDelete = useCallback((id: string) => {
    handleDeleteAssistant(id)
  }, [handleDeleteAssistant])

  const onEdit = useCallback(() => {
    if (!formFields) return
    if (!validateAssistant(formFields)) return
    handleEditAssistant(formFields)
  }, [formFields, handleEditAssistant, validateAssistant])

  if (!assistantId && isEdit && isError && error) {
    return (
      <ErrorGetData />
    )
  }

  if (isLoading) {
    return (
      <Card padding="24" max>
        <VStack gap="32">
          <HStack gap="32" max>
            <VStack gap="16" max>
              <Skeleton width="100%" height={38} />
              <Skeleton width="100%" height={38} />
              <Skeleton width="100%" height={38} />
              <Skeleton width="100%" height={38} />
              <Skeleton width="100%" height={38} />
              <Skeleton width="100%" height={38} />
            </VStack>
          </HStack>
        </VStack>
      </Card>
    )
  }

  return (
    <VStack gap="8" max className={classNames(cls.AssistantCard, {}, [className])}>
      <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
        <AssistantFormHeader
          isEdit={isEdit}
          assistantName={formFields?.name}
          assistantId={assistantId}
          onSave={isEdit ? onEdit : onCreate}
          onDelete={onDelete}
          variant="diviner-top"
        />

        <AssistantForm
          assistantId={assistantId}
        />

        <AssistantFormHeader
          isEdit={isEdit}
          assistantName={formFields?.name}
          assistantId={assistantId}
          onSave={isEdit ? onEdit : onCreate}
          onDelete={onDelete}
          variant="diviner-bottom"
        />
      </DynamicModuleLoader>
    </VStack>
  )
})
