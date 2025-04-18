import { memo } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorPage } from '../../../ErrorPage'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { AssistantCard } from '@/features/Assistants'

const AssistantEditPage = memo(() => {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
        <ErrorPage />
    )
  }
  return (
      <Page data-testid={'AssistantPage'}>
        <VStack gap='8'>
          <AssistantCard assistantId={id} isEdit/>
        </VStack>
      </Page>
  )
})

export default AssistantEditPage
