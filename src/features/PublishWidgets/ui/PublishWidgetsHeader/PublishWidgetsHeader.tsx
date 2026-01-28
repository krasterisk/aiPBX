import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishWidgetsHeader.module.scss'
import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { useNavigate } from 'react-router-dom'
import { getRoutePublishWidgetsCreate } from '@/shared/const/router'

interface PublishWidgetsHeaderProps {
    className?: string
}

export const PublishWidgetsHeader = memo((props: PublishWidgetsHeaderProps) => {
    const { className } = props
    const { t } = useTranslation('publish-widgets')
    const navigate = useNavigate()

    const onCreateClick = useCallback(() => {
        navigate(getRoutePublishWidgetsCreate())
    }, [navigate])

    return (
        <HStack max justify={'between'} className={classNames(cls.PublishWidgetsHeader, {}, [className])}>
            <Text title={t('Виджеты')} size={'l'} bold />
            <Button onClick={onCreateClick}>
                {t('Создать виджет')}
            </Button>
        </HStack>
    )
})
