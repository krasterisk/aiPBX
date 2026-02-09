import { memo } from 'react'
import { Skeleton } from '@mui/material'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './StatCard.module.scss'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { TrendIndicator } from '@/shared/ui/redesigned/TrendIndicator'

interface StatCardProps {
    className?: string
    title: string
    value: string | number
    description?: string
    icon?: React.ReactNode
    trend?: number // Percent change
    trendDirection?: 'up' | 'down' | 'neutral'
    isLoading?: boolean
    variant?: 'primary' | 'success' | 'warning' | 'error'
}

export const StatCard = memo((props: StatCardProps) => {
    const {
        className,
        title,
        value,
        description,
        icon,
        trend,
        trendDirection,
        isLoading,
        variant = 'primary'
    } = props

    if (isLoading) {
        return (
            <Card
                padding="24"
                border="partial"
                className={classNames(cls.StatCard, {}, [className])}
            >
                <HStack max justify="between" align="start">
                    <VStack gap="8" max>
                        <Skeleton variant="text" width="60%" height={20} />
                        <Skeleton variant="text" width="40%" height={36} />
                        <Skeleton variant="text" width="80%" height={16} />
                    </VStack>
                    <Skeleton variant="circular" width={48} height={48} />
                </HStack>
            </Card>
        )
    }

    return (
        <Card
            padding="24"
            border="partial"
            className={classNames(cls.StatCard, {}, [className, cls[variant]])}
        >
            <HStack max justify="between" align="start">
                <VStack gap="8">
                    <Text text={title} className={cls.title} />
                    <HStack gap="8" align="center">
                        <Text title={String(value)} className={cls.value} />
                        {trend !== undefined && (
                            <TrendIndicator
                                value={trend}
                                direction={trendDirection}
                                size="sm"
                            />
                        )}
                    </HStack>
                    {description && <Text text={description} className={cls.description} />}
                </VStack>
                {icon && <div className={cls.iconWrapper}>{icon}</div>}
            </HStack>
        </Card>
    )
})
