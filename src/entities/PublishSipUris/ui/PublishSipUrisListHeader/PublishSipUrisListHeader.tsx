import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishSipUrisListHeader.module.scss'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRoutePublishSipUrisCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/redesigned/Button'
import { usePublishSipUrisFilters } from '../../model/hooks/usePublishSipUrisFilters'
import { SearchInput } from '@/shared/ui/mui/SearchInput'
import { useSelector } from 'react-redux'
import { isUserAdmin, ClientSelect } from '@/entities/User'

interface PublishSipUrisListHeaderProps {
    className?: string
}

export const PublishSipUrisListHeader = memo((props: PublishSipUrisListHeaderProps) => {
    const { className } = props
    const { t } = useTranslation('publish-sip')
    const isAdmin = useSelector(isUserAdmin)

    const {
        search,
        onSearchChange,
        clientId,
        onClientIdChange
    } = usePublishSipUrisFilters()

    return (
        <VStack gap="16" max className={classNames(cls.PublishSipUrisListHeader, {}, [className])}>
            <HStack max justify="between" align="center" gap="16" wrap="wrap">
                <VStack gap="4">
                    <Text title={t('SIP URI')} size="l" bold />
                    <Text text={t('Настройка входящей связи через SIP протокол')} size="s" variant="accent" />
                </VStack>

                <HStack gap="16" wrap="nowrap" className={cls.headerActions}>
                    <SearchInput
                        className={cls.searchInput}
                        placeholder={t('Поиск') ?? ''}
                        onChange={onSearchChange}
                        value={search}
                        fullWidth={false}
                    />

                    <AppLink to={getRoutePublishSipUrisCreate()}>
                        <Button
                            variant="outline"
                            className={cls.createBtn}
                            addonLeft={<Plus size={20} className={cls.plusIcon} />}
                        >
                            {t('Создать SIP URI')}
                        </Button>
                    </AppLink>
                </HStack>
            </HStack>

            {isAdmin && (
                <ClientSelect
                    clientId={clientId}
                    onChangeClient={onClientIdChange}
                />
            )}
        </VStack>
    )
})
