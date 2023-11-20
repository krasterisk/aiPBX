import React, { useCallback } from 'react'
import { useGetContexts } from '../../../api/contextsApi'
import { ContextsList } from '@/entities/Pbx'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { useSelector } from 'react-redux'
import { getUserAuthData } from '@/entities/User'
import { useTranslation } from 'react-i18next'

export const Contexts = () => {
  const authData = useSelector(getUserAuthData)
  const vpbx_user_id = authData?.vpbx_user_id || '0'
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useGetContexts({ vpbx_user_id })

  const { t } = useTranslation('endpoints')

  const onRefetch = useCallback(() => {
    refetch()
  }, [refetch])

  if (isError) {
    const errMsg = error && 'data' in error
      ? String((error.data as { message: string }).message)
      : ''

    return (
        <ErrorGetData
            text={errMsg}
            onRefetch={onRefetch}
        />
    )
  }

  return (
        <ContextsList contexts={data} isLoading={isLoading} isError={isError} />
  )
}
