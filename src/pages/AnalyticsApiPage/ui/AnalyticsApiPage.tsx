import React, { memo } from 'react'
import { OperatorApiTokens } from '@/features/OperatorAnalytics'
import { VStack } from '@/shared/ui/redesigned/Stack'

const AnalyticsApiPage = () => {
    return (
        <VStack max>
            <OperatorApiTokens />
        </VStack>
    )
}

export default memo(AnalyticsApiPage)
