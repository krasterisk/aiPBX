import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantCreateCardHeader.module.scss'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'
import { Card, CardVariant } from '@/shared/ui/redesigned/Card'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteAssistants } from '@/shared/const/router'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack } from '@/shared/ui/redesigned/Stack'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import { Button } from '@/shared/ui/redesigned/Button'

interface AssistantCreateCardHeaderProps {
    className?: string
    onCreate?: () => void
    variant?: CardVariant
}

export const AssistantCreateCardHeader = memo((props: AssistantCreateCardHeaderProps) => {
    const {
        className,
        variant,
        onCreate
    } = props
    const { t } = useTranslation('assistants')

    const actions = (
        <HStack gap="8" justify="end" wrap="wrap">
            <Button
                variant={'outline'}
                color={'success'}
                onClick={onCreate}
                addonLeft={<SaveIcon />}
            >
                {t('Создать')}
            </Button>
            <AppLink to={getRouteAssistants()}>
                <Button
                    variant={'outline'}
                    addonLeft={<CloseIcon />}
                >
                    {t('Закрыть')}
                </Button>
            </AppLink>
        </HStack>
    )

    return (
        <HStack max justify={'between'} wrap={'wrap'} gap={'8'} className={classNames(cls.AssistantCreateCardHeader, {}, [className])}>
            <Text title={t('Новый голосовой ассистент')} />
            {actions}
        </HStack>
    )
})
