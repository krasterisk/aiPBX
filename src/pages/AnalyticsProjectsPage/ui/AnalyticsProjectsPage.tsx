import { memo } from 'react'
import { OperatorProjectManager } from '@/features/OperatorAnalytics'
import { VStack } from '@/shared/ui/redesigned/Stack'

const AnalyticsProjectsPage = () => {
    return (
        <VStack max>
            <OperatorProjectManager />
        </VStack>
    )
}

export default memo(AnalyticsProjectsPage)
