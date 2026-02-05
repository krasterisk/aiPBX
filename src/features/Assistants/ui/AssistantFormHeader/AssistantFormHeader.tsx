import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { classNames } from '@/shared/lib/classNames/classNames'
import { getRouteAssistants } from '@/shared/const/router'
import cls from './AssistantFormHeader.module.scss'

interface AssistantFormHeaderProps {
    className?: string
    isEdit?: boolean
    assistantName?: string
    assistantId?: string
    onSave?: () => void
    onDelete?: (id: string) => void
    isLoading?: boolean
    variant?: 'diviner-top' | 'diviner-bottom'
}

export const AssistantFormHeader = memo((props: AssistantFormHeaderProps) => {
    const {
        className,
        isEdit,
        assistantName,
        assistantId,
        onSave,
        onDelete,
        isLoading,
        variant = 'diviner-top'
    } = props

    const { t } = useTranslation('assistants')
    const navigate = useNavigate()

    const handleClose = useCallback(() => {
        navigate(getRouteAssistants())
    }, [navigate])

    const handleDelete = useCallback(() => {
        if (assistantId) {
            onDelete?.(assistantId)
        }
    }, [assistantId, onDelete])

    return (
        <HStack
            max
            justify={variant === 'diviner-bottom' ? 'end' : 'between'}
            className={classNames(
                cls.AssistantFormHeader,
                { [cls.bottom]: variant === 'diviner-bottom' },
                [className]
            )}
        >
            {variant === 'diviner-top' && (
                <VStack gap="4">
                    <Text
                        title={isEdit ? (assistantName || t('Редактирование ассистента')) : t('Новый голосовой ассистент')}
                        size="l"
                        bold
                    />
                </VStack>
            )}

            <HStack gap="8" className={cls.actions}>
                {isEdit && onDelete && (
                    <Button
                        variant='clear'
                        color="error"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {t('Удалить')}
                    </Button>
                )}

                <Button
                    variant='clear'
                    onClick={handleClose}
                    disabled={isLoading}
                >
                    {t('Закрыть')}
                </Button>

                <Button
                    onClick={onSave}
                    disabled={isLoading}
                >
                    {isEdit ? t('Сохранить') : t('Создать')}
                </Button>
            </HStack>
        </HStack>
    )
})
