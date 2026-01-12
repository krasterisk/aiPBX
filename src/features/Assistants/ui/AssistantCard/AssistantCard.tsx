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
} from '@/entities/Assistants'

import { AssistantOptionSelector } from '../AssistantOptionSelector/AssistantOptionSelector'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'
import { useTranslation } from 'react-i18next'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'

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

  const reducers: ReducersList = {
    assistantForm: assistantFormReducer
  }

  const handleCreateAssistant = useCallback((data: Assistant) => {
    assistantCreate([data])
      .unwrap()
      .then(() => {
        navigate(getRouteAssistants())
      })
      .catch((err) => {
        toast.error(getErrorMessage(err))
      })
  }, [assistantCreate, navigate])

  const onCreate = useCallback((data: Assistant) => {
    handleCreateAssistant(data)
  }, [handleCreateAssistant])

  const handleEditAssistant = useCallback((data: Assistant) => {
    assistantUpdate(data)
      .unwrap()
      .then(() => {
        toast.success(t('Сохранено успешно'))
      })
      .catch((err) => {
        toast.error(getErrorMessage(err))
      })
  }, [assistantUpdate, t])

  const handleDeleteAssistant = useCallback((id: string) => {
    assistantDelete(id)
      .unwrap()
      .then(() => {
        navigate(getRouteAssistants())
      })
      .catch((err) => {
        toast.error(getErrorMessage(err))
      })
  }, [assistantDelete, navigate])

  const onDelete = useCallback((id: string) => {
    handleDeleteAssistant(id)
  }, [handleDeleteAssistant])

  const onEdit = useCallback((data: Assistant) => {
    handleEditAssistant(data)
  }, [handleEditAssistant])

  if (!assistantId && isEdit && isError && error) {
    return (
            <ErrorGetData/>
    )
  }

  if (isLoading) {
    return (
            <Card padding="24" max>
                <VStack gap="32">
                    <HStack gap="32" max>
                        <VStack gap="16" max>
                            <Skeleton width="100%" height={38}/>
                            <Skeleton width="100%" height={38}/>
                            <Skeleton width="100%" height={38}/>
                            <Skeleton width="100%" height={38}/>
                            <Skeleton width="100%" height={38}/>
                            <Skeleton width="100%" height={38}/>
                        </VStack>
                    </HStack>
                </VStack>
            </Card>
    )
  }

  return (
        <VStack gap={'8'} max className={classNames(cls.AssistantCard, {}, [className])}>
            {
                <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
                    <AssistantOptionSelector
                        onEdit={onEdit}
                        onCreate={onCreate}
                        assistantId={assistantId || ''}
                        onDelete={onDelete}
                    />
                </DynamicModuleLoader>
            }
        </VStack>
  )
})
