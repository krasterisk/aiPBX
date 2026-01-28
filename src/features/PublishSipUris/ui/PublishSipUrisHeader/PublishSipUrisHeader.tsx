import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishSipUrisHeader.module.scss'
import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { useNavigate } from 'react-router-dom'
import { getRoutePublishSipUrisCreate } from '@/shared/const/router'

interface PublishSipUrisHeaderProps {
    className?: string
}

export const PublishSipUrisHeader = memo((props: PublishSipUrisHeaderProps) => {
    const { className } = props
    const { t } = useTranslation('publish-sip')
    const navigate = useNavigate()

    const onCreateClick = useCallback(() => {
        navigate(getRoutePublishSipUrisCreate())
    }, [navigate])

    return (
        <HStack max justify={'between'} className={classNames(cls.PublishSipUrisHeader, {}, [className])}>
            <Text title={t('SIP URIs')} size={'l'} bold />
            <Button onClick={onCreateClick}>
                {t('Создать SIP URI')}
            </Button>
        </HStack>
    )
})
