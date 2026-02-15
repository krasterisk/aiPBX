import React, { memo, useCallback } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './BusinessCard.module.scss'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { LucideIcon } from 'lucide-react'

interface BusinessCardProps {
    id: string
    Icon: LucideIcon
    label: string
    selected?: boolean
    onClick?: (id: string) => void
}

export const BusinessCard = memo((props: BusinessCardProps) => {
    const { id, Icon, label, selected, onClick } = props

    const handleClick = useCallback(() => {
        onClick?.(id)
    }, [id, onClick])

    return (
        <VStack
            gap="8"
            align="center"
            justify="center"
            className={classNames(cls.BusinessCard, { [cls.selected]: selected }, [])}
            onClick={handleClick}
            role="button"
            tabIndex={0}
        >
            <HStack justify="center" align="center" className={cls.iconBox}>
                <Icon size={20} />
            </HStack>
            <Text text={label} size="xs" align="center" className={cls.label} />
        </VStack>
    )
})
