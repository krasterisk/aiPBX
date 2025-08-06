import { memo } from 'react'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { AssistantCard } from '@/features/Assistants'

const AssistantCreatePage = memo(() => {
  return (
      <Page data-testid={'AssistantPage'}>
        <VStack gap='8'>
          <AssistantCard isEdit={false}/>
        </VStack>
      </Page>
  )
})

export default AssistantCreatePage
