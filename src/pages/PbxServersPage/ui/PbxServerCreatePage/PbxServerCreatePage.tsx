import { memo } from 'react'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { PbxServerCard } from '@/features/PbxServers'

const PbxServerCreatePage = memo(() => {
  return (
      <Page data-testid={'PbxServersCreatePage'}>
        <VStack gap='8'>
          <PbxServerCard />
        </VStack>
      </Page>
  )
})

export default PbxServerCreatePage
