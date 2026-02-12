import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { classNames } from '@/shared/lib/classNames/classNames'
import { getRouteUsers, getRouteMain } from '@/shared/const/router'
import { useSelector } from 'react-redux'
import { isUserAdmin } from '@/entities/User'
import cls from './UserFormHeader.module.scss'

interface UserFormHeaderProps {
    className?: string
    isEdit?: boolean
    userName?: string
    userId?: string
    onSave?: () => void
    onDelete?: (id: string) => void
    isLoading?: boolean
    variant?: 'diviner-top' | 'diviner-bottom'
}

export const UserFormHeader = memo((props: UserFormHeaderProps) => {
    const {
        className,
        isEdit,
        userName,
        userId,
        onSave,
        onDelete,
        isLoading,
        variant = 'diviner-top'
    } = props

    const { t } = useTranslation('users')
    const navigate = useNavigate()
    const isAdmin = useSelector(isUserAdmin)

    const handleClose = useCallback(() => {
        navigate(isAdmin ? getRouteUsers() : getRouteMain())
    }, [navigate, isAdmin])

    const handleDelete = useCallback(() => {
        if (!userId) return
        if (!window.confirm(t('Вы уверены, что хотите удалить пользователя?') ?? '')) return
        onDelete?.(userId)
    }, [userId, onDelete, t])

    return (
        <HStack
            max
            justify={variant === 'diviner-bottom' ? 'start' : 'between'}
            className={classNames(
                cls.UserFormHeader,
                { [cls.bottom]: variant === 'diviner-bottom' },
                [className]
            )}
        >
            {variant === 'diviner-top' && (
                <VStack gap="4">
                    <Text
                        title={isEdit ? (userName || t('Редактирование пользователя')) : t('Новый пользователь')}
                        size="l"
                        bold
                    />
                </VStack>
            )}

            <HStack gap="8" className={cls.actions}>
                {isEdit && isAdmin && onDelete && (
                    <Button
                        variant="clear"
                        color="error"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {t('Удалить')}
                    </Button>
                )}

                <Button
                    variant="clear"
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
