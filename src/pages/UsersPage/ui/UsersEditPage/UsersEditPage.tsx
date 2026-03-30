import React, { memo } from 'react'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { useParams, Navigate } from 'react-router-dom'
import { ErrorPage } from '../../../ErrorPage'
import { UserCard } from '@/features/Users'

import { useSelector } from 'react-redux'
import { isSubUser, getUserAuthData } from '@/entities/User'
import { getRouteMain } from '@/shared/const/router'

const UsersEditPage = memo(() => {
  const { id } = useParams<{ id: string }>()
  const isSub = useSelector(isSubUser)
  const authData = useSelector(getUserAuthData)

  if (isSub && id !== String(authData?.id)) {
    return <Navigate to={getRouteMain()} replace />
  }

  if (!id) {
    return (
            <ErrorPage />
    )
  }

  return (
        <Page data-testid={'UsersEditPage'}>
            <VStack gap='8'>
                <UserCard isEdit userId={id} />
            </VStack>
        </Page>
  )
})

export default UsersEditPage
