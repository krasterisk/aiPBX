import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServerFormHeader.module.scss'

interface PbxServerFormHeaderProps {
    className?: string
    isEdit?: boolean
    serverName?: string
    onSave?: () => void
    onClose?: () => void
    onDelete?: () => void
    isLoading?: boolean
    variant?: 'diviner-top' | 'diviner-bottom'
}

export const PbxServerFormHeader = memo((props: PbxServerFormHeaderProps) => {
    const {
        className,
        isEdit,
        serverName,
        onSave,
        onClose,
        onDelete,
        isLoading,
        variant = 'diviner-top'
    } = props

    const { t } = useTranslation('pbx')

    return (
        <HStack
            max
            justify="between"
            className={classNames(cls.PbxServerFormHeader, { [cls.bottom]: variant === 'diviner-bottom' }, [className])}
        >
            <VStack gap="4">
                <Text
                    title={isEdit ? (serverName || t('Редактирование сервера')) : t('Новый сервер')}
                    size="l"
                    bold
                />
            </VStack>

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
