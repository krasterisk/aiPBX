import { memo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Card } from '@/shared/ui/redesigned/Card'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import cls from './AiInsightsBanner.module.scss'

interface Insight {
    id: string
    title: string
    description: string
    type: 'success' | 'warning' | 'info'
}

interface AiInsightsBannerProps {
    projectName?: string
}

// Stub insights — in future fetched from backend
const MOCK_INSIGHTS: Insight[] = [
    {
        id: '1',
        title: 'Рост качества приветствия',
        description: 'За последнюю неделю средний балл приветствия вырос на 12%, что коррелирует с обновлением скрипта.',
        type: 'success'
    },
    {
        id: '2',
        title: 'Падение конверсии',
        description: 'Успешность звонков снизилась на 8% — возможно, требуется обновление обработки возражений.',
        type: 'warning'
    },
    {
        id: '3',
        title: 'Новый паттерн',
        description: 'Обнаружено 15 звонков с негативным сентиментом от клиентов, упоминающих задержку доставки.',
        type: 'info'
    }
]

const INSIGHT_ICONS: Record<string, string> = {
    success: '📈',
    warning: '⚠️',
    info: '💡'
}

export const AiInsightsBanner = memo(({ projectName }: AiInsightsBannerProps) => {
    const { t } = useTranslation('reports')
    const [isExpanded, setIsExpanded] = useState(false)

    const toggle = useCallback(() => setIsExpanded(p => !p), [])

    return (
        <Card max variant={'glass'} border={'partial'} padding={'16'} className={cls.banner}>
            <VStack gap={'12'} max>
                <HStack max justify={'between'} align={'center'}>
                    <HStack gap={'8'} align={'center'}>
                        <AutoAwesomeIcon sx={{ color: 'var(--accent-redesigned)', fontSize: 20 }} />
                        <Text text={String(t('AI Инсайты'))} bold />
                        {projectName && <Text text={`— ${projectName}`} size={'s'} />}
                    </HStack>
                    <Button variant={'clear'} size={'s'} onClick={toggle}>
                        {isExpanded
                            ? <ExpandLessIcon fontSize={'small'} />
                            : <ExpandMoreIcon fontSize={'small'} />
                        }
                    </Button>
                </HStack>

                {isExpanded && (
                    <VStack gap={'8'} max className={cls.insightsList}>
                        {MOCK_INSIGHTS.map(insight => (
                            <div key={insight.id} className={`${cls.insightItem} ${cls[insight.type]}`}>
                                <HStack gap={'8'} align={'start'}>
                                    <span className={cls.insightIcon}>{INSIGHT_ICONS[insight.type]}</span>
                                    <VStack gap={'4'}>
                                        <Text text={insight.title} bold size={'s'} />
                                        <Text text={insight.description} size={'s'} />
                                    </VStack>
                                </HStack>
                            </div>
                        ))}
                    </VStack>
                )}

                {!isExpanded && (
                    <Text
                        text={`${MOCK_INSIGHTS.length} ${t('инсайтов')} — ${t('нажмите для просмотра')}`}
                        size={'s'}
                        className={cls.hint}
                    />
                )}
            </VStack>
        </Card>
    )
})
