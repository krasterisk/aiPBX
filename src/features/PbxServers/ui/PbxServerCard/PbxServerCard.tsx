import React, { memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRoutePbxServers } from '@/shared/const/router'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServerCard.module.scss'

import {
  useDeletePbxServers,
  useSetPbxServers,
  useUpdatePbxServers,
  PbxServer
} from '@/entities/PbxServers'

import { PbxServerEditCard } from '../PbxServerEditCard/PbxServerEditCard'
import { PbxServerCreateCard } from '../PbxServerCreateCard/PbxServerCreateCard'

export interface PbxServerCardProps {
  className?: string
  error?: string
  isLoading?: boolean
  readonly?: boolean
  isEdit?: boolean
  pbxServerId?: string
}

export const PbxServerCard = memo((props: PbxServerCardProps) => {
  const {
    className,
    isLoading,
    isEdit,
    pbxServerId
  } = props

  const [pbxServerCreate] = useSetPbxServers()
  const [pbxServerUpdate] = useUpdatePbxServers()
  const [pbxServerDelete] = useDeletePbxServers()

  const navigate = useNavigate()

  const handleCreatePbxServer = useCallback((data: PbxServer) => {
    pbxServerCreate([data]).then((res) => {
      if ('error' in res) return
      navigate(getRoutePbxServers())
    })
  }, [pbxServerCreate, navigate])

  const onCreate = useCallback((data: PbxServer) => {
    handleCreatePbxServer(data)
  }, [handleCreatePbxServer])

  const handleEditPbxServer = useCallback((data: PbxServer) => {
    try {
      pbxServerUpdate(data).unwrap()
    } finally {
      navigate(getRoutePbxServers())
    }
  }, [navigate, pbxServerUpdate])

  const handleDeletePbxServer = useCallback((id: string) => {
    pbxServerDelete(id)
      .unwrap()
      .then(() => {
        navigate(getRoutePbxServers())
      })
  }, [pbxServerDelete, navigate])

  const onDelete = useCallback((id: string) => {
    handleDeletePbxServer(id)
  }, [handleDeletePbxServer])

  const onEdit = useCallback((data: PbxServer) => {
    handleEditPbxServer(data)
  }, [handleEditPbxServer])

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
      <VStack gap={'8'} max className={classNames(cls.PbxServerCard, {}, [className])}>
        {
          isEdit && pbxServerId
            ? <PbxServerEditCard
                  key={`edit-form-${pbxServerId}`}
                  onEdit={onEdit}
                  pbxServerId={pbxServerId}
                  onDelete={onDelete}
              />
            : <PbxServerCreateCard
                  key={`create-form-${Date.now()}`}
                  onCreate={onCreate}
              />

        }
      </VStack>
  )
})
