import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { classNames } from '@/shared/lib/classNames/classNames'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import cls from './VisualPositionGrid.module.scss'

interface VisualPositionGridProps {
    className?: string
    value: string
    onChange: (value: string) => void
}

const positions = [
    { value: 'top-left', label: 'TL' },
    { value: 'top-right', label: 'TR' },
    { value: 'bottom-left', label: 'BL' },
    { value: 'bottom-right', label: 'BR' },
]

export const VisualPositionGrid = memo(({ className, value, onChange }: VisualPositionGridProps) => {
    const { t } = useTranslation('publish-widgets')

    return (
        <VStack gap="8" className={classNames(cls.VisualPositionGrid, {}, [className])}>
            <Text text={t('Позиция кнопки')} size="s" />
            <div className={cls.grid}>
                {positions.map((pos) => (
                    <div
                        key={pos.value}
                        className={classNames(cls.item, { [cls.active]: value === pos.value })}
                        onClick={() => { onChange(pos.value) }}
                        title={(t(pos.value))}
                    >
                        <div className={cls.dot} />
                    </div>
                ))}
            </div>
        </VStack>
    )
})
