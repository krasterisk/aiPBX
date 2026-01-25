import { memo } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './StatCard.module.scss'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'

interface StatCardProps {
    className?: string
    title: string
    value: string | number
    description?: string
    icon?: React.ReactNode
    trend?: number // Percent
}

export const StatCard = memo((props: StatCardProps) => {
    const {
        className,
        title,
        value,
        description,
        icon,
        trend
    } = props

    return (
        <Card
            padding="24"
            border="partial"
            className={classNames(cls.StatCard, {}, [className])}
        >
            <HStack max justify="between" align="start">
                <VStack gap="8">
                    <Text text={title} className={cls.title} />
                    <Text title={String(value)} className={cls.value} />
                    {description && <Text text={description} className={cls.description} />}
                </VStack>
                {icon && <div className={cls.iconWrapper}>{icon}</div>}
            </HStack>
        </Card>
    )
})
