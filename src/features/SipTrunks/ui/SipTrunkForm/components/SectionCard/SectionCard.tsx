import { ReactNode } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './SectionCard.module.scss'

interface SectionCardProps {
    className?: string
    title: string
    icon?: React.ElementType
    rightElement?: ReactNode
    children: ReactNode
}

export const SectionCard = ({ className, title, icon, rightElement, children }: SectionCardProps) => {
    return (
        <Card
            padding="24"
            max
            border="partial"
            className={classNames(cls.SectionCard, {}, [className])}
        >
            <VStack gap="24" max>
                <HStack gap="8" align="center" max justify="between">
                    <HStack gap="8" align="center">
                        {icon && <Icon Svg={icon as any} width={20} height={20} className={cls.icon} />}
                        <Text title={title} size="m" bold />
                    </HStack>
                    {rightElement}
                </HStack>
                <VStack gap="16" max>
                    {children}
                </VStack>
            </VStack>
        </Card>
    )
}
