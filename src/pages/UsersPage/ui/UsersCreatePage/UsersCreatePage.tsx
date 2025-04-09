import React, { memo } from 'react'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { UserCard } from '@/features/Users'

const UsersCreatePage = memo(() => {
  return (
        <Page data-testid={'CaskPage'}>
            <VStack gap='8'>
                <UserCard />
            </VStack>
        </Page>
  )
})

export default UsersCreatePage
