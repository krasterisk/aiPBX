import React, { memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRouteTools } from '@/shared/const/router'
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

  const [toolCreate] = useSetTools()
  const [toolUpdate] = useUpdateTool()
  const [toolDelete] = useDeleteTool()

  const navigate = useNavigate()

  const handleCreateTool = useCallback((data: Tool) => {
    toolCreate([data]).then((res) => {
      if ('error' in res) return
      navigate(getRouteTools())
    })
  }, [toolCreate, navigate])

  const onCreate = useCallback((data: Tool) => {
    handleCreateTool(data)
  }, [handleCreateTool])

  const handleEditTool = useCallback((data: Tool) => {
    try {
      toolUpdate(data).unwrap()
    } finally {
      navigate(getRouteTools())
    }
  }, [navigate, toolUpdate])

  const handleDeleteTool = useCallback((id: string) => {
    toolDelete(id)
      .unwrap()
      .then(() => {
        navigate(getRouteTools())
      })
  }, [toolDelete, navigate])

  const onDelete = useCallback((id: string) => {
    handleDeleteTool(id)
  }, [handleDeleteTool])

  const onEdit = useCallback((data: Tool) => {
    handleEditTool(data)
  }, [handleEditTool])

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
                  toolId={toolId}
                  onDelete={onDelete}
              />
            : <ToolCreateCard
                  key={`create-form-${Date.now()}`}
                  onCreate={onCreate}
              />

        }
      </VStack>
  )
})
