import { memo } from 'react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { AIAnalyticsResponse } from '@/entities/Report'
import { NLUMetricsCard } from '../NLUMetricsCard/NLUMetricsCard'
import { SpeechQualityCard } from '../SpeechQualityCard/SpeechQualityCard'
import { BusinessImpactCard } from '../BusinessImpactCard/BusinessImpactCard'
import { SentimentAnalysisCard } from '../SentimentAnalysisCard/SentimentAnalysisCard'
import { AssistantComparisonTable } from '../AssistantComparisonTable/AssistantComparisonTable'
import { TopIssuesChart } from '../TopIssuesChart/TopIssuesChart'
import cls from './AIMetricsOverview.module.scss'

interface AIMetricsOverviewProps {
    className?: string
    data?: AIAnalyticsResponse
    isLoading?: boolean
}

export const AIMetricsOverview = memo((props: AIMetricsOverviewProps) => {
    const { className, data, isLoading } = props

    return (
        <VStack gap="16" max className={className}>
            {/* Row 1: NLU Metrics (full width) */}
            <NLUMetricsCard metrics={data?.metrics} isLoading={isLoading} />

            {/* Row 2: Sentiment + Business Impact side by side */}
            <div className={cls.row}>
                <div className={cls.col60}>
                    <SentimentAnalysisCard metrics={data?.metrics} isLoading={isLoading} />
                </div>
                <div className={cls.col40}>
                    <BusinessImpactCard metrics={data?.metrics} isLoading={isLoading} />
                </div>
            </div>

            {/* Row 3: Speech Quality (full width) */}
            <SpeechQualityCard metrics={data?.metrics} isLoading={isLoading} />

            {/* Row 4: Top Issues + Assistant Comparison side by side */}
            <div className={cls.row}>
                <div className={cls.col50}>
                    <TopIssuesChart issues={data?.topIssues} isLoading={isLoading} />
                </div>
                <div className={cls.col50}>
                    <AssistantComparisonTable
                        assistants={data?.assistantMetrics}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </VStack>
    )
})
