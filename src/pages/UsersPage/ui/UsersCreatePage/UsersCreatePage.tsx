import React, { memo } from 'react'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { UserCard } from '@/features/Users'

import { useSelector } from 'react-redux'
import { isSubUser } from '@/entities/User'
import { Navigate } from 'react-router-dom'
import { getRouteMain } from '@/shared/const/router'

const UsersCreatePage = memo(() => {
  const isSub = useSelector(isSubUser)

  if (isSub) {
    return <Navigate to={getRouteMain()} replace />
  }

  return (
        <Page data-testid={'CaskPage'}>
            <VStack gap='8'>
                <UserCard />
            </VStack>
        </Page>
  )
})

export default UsersCreatePage
