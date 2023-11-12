import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './EndpointsList.module.scss'
import React, { useCallback } from 'react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { Card } from '@/shared/ui/redesigned/Card'
import { Table } from '@/shared/ui/redesigned/Table/Table'
import { Endpoint, EndpointsListProps } from '../../model/types/endpoints'
import { EndpointsListHeader } from '../EndpointsListHeader/EndpointsListHeader'
import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { useNavigate } from 'react-router-dom'
import { getRouteEndpointEdit } from '@/shared/const/router'

const EndpointsList = (props: EndpointsListProps) => {
  const {
    className,
    isLoading,
    isError,
    endpoints
  } = props

  const { t } = useTranslation('endpoints')
  const navigate = useNavigate()
  const columnHelper = createColumnHelper<Endpoint>()

  const endpointsColumns = [
    columnHelper.accessor('id', {
      id: 'id',
      cell: info => info.getValue(),
      header: () => t('Id')
    }),
    columnHelper.accessor('endpoint_id', {
      id: 'endpoint_id',
      cell: info => info.getValue(),
      header: () => t('Номер')
    }),
    columnHelper.accessor(row => row.username, {
      id: 'UserName',
      cell: info => <i>{info.getValue()}</i>,
      header: () => t('Имя пользователя')
    }),
    columnHelper.accessor('context', {
      header: () => t('Контекст'),
      cell: info => info.renderValue()
    }),
    columnHelper.accessor('allow', {
      header: () => t('Кодеки')
    })
  ]

  const handlerOnEdit = useCallback((id: string) => {
    navigate(getRouteEndpointEdit(id))
  }, [navigate])

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
        <VStack gap={'16'} max className={classNames(cls.EndpointsList, {}, [className])}>
            <Card
                className={cls.EndpointsListHeader}
                padding={'8'}
                max
                border={'partial'}
            >
                <EndpointsListHeader/>
            </Card>
            <Card
                className={cls.EndpointsTable}
                padding={'24'}
                max
                border={'partial'}
            >
                <Table data={endpoints} columns={endpointsColumns} onEdit={handlerOnEdit}/>
            </Card>
        </VStack>
  )
}

export default EndpointsList
