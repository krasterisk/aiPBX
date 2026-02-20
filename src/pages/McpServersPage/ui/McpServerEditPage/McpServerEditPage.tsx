import { memo } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorPage } from '../../../ErrorPage'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { McpServerForm } from '@/features/Tools'

const McpServerEditPage = memo(() => {
    const { id } = useParams<{ id: string }>()

    if (!id) {
        return (
            <ErrorPage />
        )
    }
    return (
        <Page data-testid={'McpServerEditPage'}>
            <VStack gap='8' max>
                <McpServerForm isEdit serverId={id} />
            </VStack>
        </Page>
    )
})

export default McpServerEditPage
