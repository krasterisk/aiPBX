import { memo } from 'react'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { McpServerForm } from '@/features/Tools'

const McpServerCreatePage = memo(() => {
    return (
        <Page data-testid={'McpServerCreatePage'}>
            <VStack gap='8' max>
                <McpServerForm />
            </VStack>
        </Page>
    )
})

export default McpServerCreatePage
