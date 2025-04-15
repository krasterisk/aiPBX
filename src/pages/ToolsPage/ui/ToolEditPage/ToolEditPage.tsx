import { memo } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorPage } from '../../../ErrorPage'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { ToolCard } from '@/features/Tools'

const ToolEditPage = memo(() => {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
        <ErrorPage />
    )
  }
  return (
      <Page data-testid={'ToolPage'}>
        <VStack gap='8'>
          <ToolCard isEdit toolId={id}/>
        </VStack>
      </Page>
  )
})

export default ToolEditPage
