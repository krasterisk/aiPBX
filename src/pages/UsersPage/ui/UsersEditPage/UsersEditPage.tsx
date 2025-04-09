import React, { memo } from 'react'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { useParams } from 'react-router-dom'
import { ErrorPage } from '../../../ErrorPage'
import { UserCard } from '@/features/Users'

const UsersEditPage = memo(() => {
  const { id } = useParams<{ id: string }>()

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
