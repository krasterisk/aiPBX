import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishSipUrisFormHeader.module.scss'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { CardVariant } from '@/shared/ui/redesigned/Card'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRoutePublishSipUris } from '@/shared/const/router'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'

interface PublishSipUrisFormHeaderProps {
    className?: string
    onSave?: () => void
    isEdit?: boolean
    isLoading?: boolean
    variant?: CardVariant
}

export const PublishSipUrisFormHeader = memo((props: PublishSipUrisFormHeaderProps) => {
    const {
        className,
        onSave,
        isEdit,
        isLoading,
        variant
    } = props
    const { t } = useTranslation('publish-sip')

    const actions = (
        <HStack gap="8" justify="end" wrap="wrap">
            <Button
                variant={'outline'}
                color={'success'}
                onClick={onSave}
                disabled={isLoading}
                addonLeft={<SaveIcon />}
            >
                {isEdit ? t('Сохранить') : t('Создать')}
            </Button>
            <AppLink to={getRoutePublishSipUris()}>
                <Button
                    variant={'outline'}
                    addonLeft={<CloseIcon />}
                    disabled={isLoading}
                >
                    {t('Закрыть')}
                </Button>
            </AppLink>
        </HStack>
    )

    return (
        <HStack max justify={'between'} wrap={'wrap'} gap={'8'} className={classNames(cls.PublishSipUrisFormHeader, {}, [className])}>
            {variant !== 'diviner-bottom' && (
                <Text title={isEdit ? t('Редактирование SIP URI') : t('Создание SIP URI')} />
            )}
            {actions}
        </HStack>
    )
})
