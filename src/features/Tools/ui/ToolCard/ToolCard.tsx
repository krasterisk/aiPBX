import React, { memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRouteTools } from '@/shared/const/router'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolCard.module.scss'

import {
  useDeleteTool,
  useSetTools,
  useUpdateTool,
  Tool
} from '@/entities/Tools'

import { ToolEditCard } from '../ToolEditCard/ToolEditCard'
import { ToolCreateCard } from '../ToolCreateCard/ToolCreateCard'

export interface ToolCardProps {
  className?: string
  error?: string
  isLoading?: boolean
  readonly?: boolean
  isEdit?: boolean
  toolId?: string
}

export const ToolCard = memo((props: ToolCardProps) => {
  const {
    className,
    isLoading,
    isEdit,
    toolId
  } = props

  const [toolMutation, { isError, error }] = useSetTools()
  const [toolUpdateMutation] = useUpdateTool()
  const [toolDeleteMutation] = useDeleteTool()

  const navigate = useNavigate()

  const handleCreateTool = useCallback((data: Tool) => {
    toolMutation([data])
      .unwrap()
      .then(() => {
        navigate(getRouteTools())
      })
      .catch(() => {
      })
  }, [toolMutation, navigate])

  const onCreate = useCallback((data: Tool) => {
    handleCreateTool(data)
  }, [handleCreateTool])

  const handleEditTool = useCallback((data: Tool) => {
    try {
      toolUpdateMutation(data).unwrap()
    } finally {
      navigate(getRouteTools())
    }
  }, [navigate, toolUpdateMutation])

  const handleDeleteTool = useCallback((id: string) => {
    try {
      toolDeleteMutation(id).unwrap()
    } finally {
      navigate(getRouteTools())
    }
  }, [toolDeleteMutation, navigate])

  const onDelete = useCallback((id: string) => {
    handleDeleteTool(id)
  }, [handleDeleteTool])

  const onEdit = useCallback((data: Tool) => {
    handleEditTool(data)
  }, [handleEditTool])

  if (!toolId && isEdit) {
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
      <VStack gap={'8'} max className={classNames(cls.EndpointCard, {}, [className])}>
        {
          isEdit && toolId
            ? <ToolEditCard
                  key={`edit-form-${toolId}`}
                  onEdit={onEdit}
                  isError={isError}
                  toolId={toolId}
                  onDelete={onDelete}
              />
            : <ToolCreateCard
                  key={`create-form-${Date.now()}`}
                  onCreate={onCreate}
                  isError={isError}
                  error={error}
              />

        }
      </VStack>
  )
})
