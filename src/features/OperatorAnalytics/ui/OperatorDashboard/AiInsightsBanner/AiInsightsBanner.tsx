import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@mui/material'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Card } from '@/shared/ui/redesigned/Card'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { useLazyGetOperatorInsights } from '@/entities/Report'
import cls from './AiInsightsBanner.module.scss'

interface AiInsightsBannerProps {
    projectName?: string
    queryParams?: {
        startDate?: string
        endDate?: string
        projectId?: string
    }
}

export const AiInsightsBanner = memo(({ projectName, queryParams }: AiInsightsBannerProps) => {
    const { t } = useTranslation('reports')
    const [triggerInsights, { data, isLoading, isFetching }] = useLazyGetOperatorInsights()

    const handleFetch = useCallback(() => {
        triggerInsights(queryParams ?? {})
    }, [triggerInsights, queryParams])

    const insights = data?.insights ?? []
    const loading = isLoading || isFetching

    return (
        <Card max variant={'glass'} border={'partial'} padding={'16'} className={cls.banner}>
            <VStack gap={'12'} max>
                <HStack max justify={'between'} align={'center'}>
                    <HStack gap={'8'} align={'center'}>
                        <AutoAwesomeIcon sx={{ color: 'var(--accent-redesigned)', fontSize: 20 }} />
                        <Text text={String(t('AI Инсайты'))} bold />
                        {projectName && <Text text={`— ${projectName}`} size={'s'} />}
                    </HStack>

                    {!data && !loading && (
                        <Button variant={'glass-action'} size={'s'} onClick={handleFetch}>
                            {String(t('Получить инсайты'))}
                        </Button>
                    )}
                </HStack>

                {loading && <Skeleton variant="rounded" height={80} width="100%" />}

                {insights.length > 0 && (
                    <VStack gap={'8'} max className={cls.insightsList}>
                        {insights.map((text, i) => (
                            <div key={i} className={cls.insightItem}>
                                <HStack gap={'8'} align={'start'}>
                                    <span className={cls.insightIcon}>💡</span>
                                    <Text text={text} size={'s'} />
                                </HStack>
                            </div>
                        ))}
                        {data?.generatedAt && (
                            <Text
                                text={`${t('Сгенерировано')}: ${new Date(data.generatedAt).toLocaleString()}`}
                                size={'xs'}
                                className={cls.hint}
                            />
                        )}
                    </VStack>
                )}

                {data && insights.length === 0 && (
                    <Text text={String(t('Недостаточно данных для генерации инсайтов'))} size={'s'} />
                )}
            </VStack>
        </Card>
    )
})
