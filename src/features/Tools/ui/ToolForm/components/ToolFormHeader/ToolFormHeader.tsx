import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolFormHeader.module.scss'

interface ToolFormHeaderProps {
    className?: string
    isEdit?: boolean
    toolName?: string
    onSave?: () => void
    onClose?: () => void
    onDelete?: () => void
    isLoading?: boolean
    variant?: 'diviner-top' | 'diviner-bottom'
}

export const ToolFormHeader = memo((props: ToolFormHeaderProps) => {
    const {
        className,
        isEdit,
        toolName,
        onSave,
        onClose,
        onDelete,
        isLoading,
        variant = 'diviner-top'
    } = props

    const { t } = useTranslation('tools')

    return (
        <HStack
            max
            justify={variant === 'diviner-bottom' ? 'end' : 'between'}
            className={classNames(cls.ToolFormHeader, { [cls.bottom]: variant === 'diviner-bottom' }, [className])}
        >
            {variant === 'diviner-top' && (
                <VStack gap="4">
                    <Text
                        title={isEdit ? (toolName || t('Редактирование')) : t('Новая функция')}
                        size="l"
                        bold
                    />
                </VStack>
            )}

            <HStack gap="16" className={cls.actions}>
                <Button
                    variant="clear"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    {t('Закрыть')}
                </Button>
                <Button
                    variant="outline"
                    onClick={onSave}
                    disabled={isLoading}
                >
                    {isEdit ? t('Сохранить') : t('Создать')}
                </Button>
            </HStack>
        </HStack>
    )
})
