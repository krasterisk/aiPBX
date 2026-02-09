import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { LinearProgress } from '@mui/material'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { TopIssue } from '@/entities/Report'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './TopIssuesChart.module.scss'

interface TopIssuesChartProps {
    className?: string
    issues?: TopIssue[]
    isLoading?: boolean
    onIssueClick?: (intent: string) => void
}

export const TopIssuesChart = memo((props: TopIssuesChartProps) => {
    const { className, issues = [], isLoading, onIssueClick } = props
    const { t } = useTranslation('reports')

    // Take top 10 issues
    const topIssues = issues.slice(0, 10)
    const maxCount = topIssues.length > 0
        ? Math.max(...topIssues.map(i => i.count))
        : 1

    if (topIssues.length === 0) {
        return (
            <Card
                max
                border="partial"
                padding="24"
                className={classNames(cls.TopIssuesChart, {}, [className])}
            >
                <VStack gap="16" max>
                    <Text title={t('Top Fallback Intents (Issues)')} bold />
                    <div className={cls.emptyMessage}>
                        <Text text={t('No issues detected')} />
                    </div>
                </VStack>
            </Card>
        )
    }

    return (
        <Card
            max
            border="partial"
            padding="24"
            className={classNames(cls.TopIssuesChart, {}, [className])}
        >
            <VStack gap="16" max>
                <Text title={t('Top Fallback Intents (Issues)')} bold />
                <div className={cls.issuesList}>
                    {topIssues.map((issue, index) => {
                        const percentage = (issue.count / maxCount) * 100

                        return (
                            <div
                                className={cls.issueRow}
                                key={index}
                                onClick={() => onIssueClick?.(issue.intent)}
                            >
                                <div className={cls.issueHeader}>
                                    <div className={cls.issueRank}>{index + 1}</div>
                                    <Text
                                        text={issue.intent}
                                        className={cls.issueLabel}
                                    />
                                    <Text
                                        text={String(issue.count)}
                                        className={cls.issueCount}
                                        bold
                                    />
                                </div>
                                <LinearProgress
                                    variant="determinate"
                                    value={percentage}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 3,
                                            background: `linear-gradient(90deg, #f44336 ${percentage}%, #ff7043 100%)`
                                        }
                                    }}
                                />
                            </div>
                        )
                    })}
                </div>
            </VStack>
        </Card>
    )
})
