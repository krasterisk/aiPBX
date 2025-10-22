import { memo } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorPage } from '../../../ErrorPage'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { PbxServerCard } from '@/features/PbxServers'

const PbxServerEditPage = memo(() => {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
        <ErrorPage />
    )
  }
  return (
      <Page data-testid={'PbxServerPage'}>
        <VStack gap='8'>
          <PbxServerCard isEdit pbxServerId={id}/>
        </VStack>
      </Page>
  )
})

export default PbxServerEditPage
