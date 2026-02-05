import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishWidgetsFormHeader.module.scss'

interface PublishWidgetsFormHeaderProps {
    className?: string
    isEdit?: boolean
    widgetName?: string
    onSave?: () => void
    onClose?: () => void
    onDelete?: () => void
    isLoading?: boolean
    variant?: 'diviner-top' | 'diviner-bottom'
}

export const PublishWidgetsFormHeader = memo((props: PublishWidgetsFormHeaderProps) => {
    const {
        className,
        isEdit,
        widgetName,
        onSave,
        onClose,
        onDelete,
        isLoading,
        variant = 'diviner-top'
    } = props

    const { t } = useTranslation('publish-widgets')

    return (
        <HStack
            max
            justify="between"
            className={classNames(cls.PublishWidgetsFormHeader, { [cls.bottom]: variant === 'diviner-bottom' }, [className])}
        >
            <VStack gap="4">
                {variant !== 'diviner-bottom' && (
                    <Text
                        title={isEdit ? (widgetName || t('Редактирование виджета')) : t('Создание виджета')}
                        size="l"
                        bold
                    />
                )}
            </VStack>

            <HStack gap="16" className={cls.actions}>
                {isEdit && onDelete && (
                    <Button
                        variant="clear"
                        color="error"
                        onClick={onDelete}
                        disabled={isLoading}
                    >
                        {t('Удалить')}
                    </Button>
                )}
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
