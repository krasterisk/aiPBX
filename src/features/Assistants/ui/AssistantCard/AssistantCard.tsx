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
  Assistant
} from '@/entities/Assistants'

import { AssistantEditCard } from '../AssistantEditCard/AssistantEditCard'
import { AssistantCreateCard } from '../AssistantCreateCard/AssistantCreateCard'

export interface AssistantCardProps {
  className?: string
  error?: string
  isLoading?: boolean
  readonly?: boolean
  isEdit?: boolean
  assistantId?: string
}

export const AssistantCard = memo((props: AssistantCardProps) => {
  const {
    className,
    isLoading,
    isEdit,
    assistantId
  } = props

  const [assistantMutation, { isError, error }] = useSetAssistants()
  const [assistantUpdateMutation] = useUpdateAssistant()
  const [assistantDeleteMutation] = useDeleteAssistant()

  const navigate = useNavigate()

  const handleCreateAssistant = useCallback((data: Assistant) => {
    assistantMutation([data])
      .unwrap()
      .then(() => {
        navigate(getRouteAssistants())
      })
      .catch(() => {
      })
  }, [assistantMutation, navigate])

  const onCreate = useCallback((data: Assistant) => {
    handleCreateAssistant(data)
  }, [handleCreateAssistant])

  const handleEditAssistant = useCallback(async (data: Assistant) => {
    try {
      await assistantUpdateMutation(data).unwrap()
    } finally {
      navigate(getRouteAssistants())
    }
  }, [navigate, assistantUpdateMutation])

  const handleDeleteAssistant = useCallback(async (id: string) => {
    try {
      await assistantDeleteMutation(id).unwrap()
    } finally {
      navigate(getRouteAssistants())
    }
  }, [assistantDeleteMutation, navigate])

  const onDelete = useCallback((id: string) => {
    handleDeleteAssistant(id)
  }, [handleDeleteAssistant])

  const onEdit = useCallback((data: Assistant) => {
    handleEditAssistant(data)
  }, [handleEditAssistant])

  if (!assistantId && isEdit) {
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
          isEdit
            ? <AssistantEditCard
                  onEdit={onEdit}
                  isError={isError}
                  assistantId={assistantId || ''}
                  onDelete={onDelete}
              />
            : <AssistantCreateCard
                  onCreate={onCreate}
                  isError={isError}
                  error={error}
              />

        }
      </VStack>
  )
})
