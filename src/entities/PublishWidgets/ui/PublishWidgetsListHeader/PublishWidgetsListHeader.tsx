import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishWidgetsListHeader.module.scss'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRoutePublishWidgetsCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/redesigned/Button'
import { usePublishWidgetsFilters } from '../../model/hooks/usePublishWidgetsFilters'
import { ClientSelect, isUserAdmin } from '@/entities/User'
import { useSelector } from 'react-redux'
import { SearchInput } from '@/shared/ui/mui/SearchInput'

interface PublishWidgetsListHeaderProps {
    className?: string
}

export const PublishWidgetsListHeader = memo((props: PublishWidgetsListHeaderProps) => {
    const { className } = props
    const {
        search,
        onSearchChange,
        clientId,
        onClientIdChange
    } = usePublishWidgetsFilters()

    const { t } = useTranslation('publish-widgets')
    const isAdmin = useSelector(isUserAdmin)

    return (
        <VStack gap="16" max className={classNames(cls.PublishWidgetsListHeader, {}, [className])}>
            <HStack max justify="between" align="center" gap="16" wrap="wrap">
                <VStack gap="4">
                    <Text title={t('Виджеты')} size="l" bold />
                    <Text text={t('Управление и настройка виджетов для сайта')} size="s" variant="accent" />
                </VStack>

                <HStack gap="16" wrap="nowrap" className={cls.headerActions}>
                    <SearchInput
                        className={cls.searchInput}
                        placeholder={t('Поиск') ?? ''}
                        onChange={onSearchChange}
                        value={search}
                        fullWidth={false}
                    />

                    <AppLink to={getRoutePublishWidgetsCreate()}>
                        <Button
                            variant="outline"
                            className={cls.createBtn}
                            addonLeft={<Plus size={20} className={cls.plusIcon} />}
                        >
                            {t('Создать виджет')}
                        </Button>
                    </AppLink>
                </HStack>
            </HStack>

            {isAdmin && (
                <ClientSelect
                    clientId={clientId}
                    onChangeClient={onClientIdChange}
                    placeholder={t('Все клиенты') ?? 'Все клиенты'}
                />
            )}
        </VStack>
    )
})
