import { memo } from 'react'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { ToolCard } from '@/features/Tools'

const ToolCreatePage = memo(() => {
  return (
        <Page data-testid={'ToolsCreatePage'}>
            <VStack gap='8'>
                <ToolCard />
            </VStack>
        </Page>
  )
})

export default ToolCreatePage
