import { memo } from 'react'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { PbxServerForm } from '@/features/PbxServers'

const PbxServerCreatePage = memo(() => {
  return (
    <Page data-testid={'PbxServersCreatePage'}>
      <VStack gap='8'>
        <PbxServerForm />
      </VStack>
    </Page>
  )
})

export default PbxServerCreatePage
