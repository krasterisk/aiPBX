import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishWidgetsListHeader.module.scss'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRoutePublishWidgetsCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { useMediaQuery } from '@mui/material'
import { Input } from '@/shared/ui/redesigned/Input'
import { Text } from '@/shared/ui/redesigned/Text'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/shared/ui/redesigned/Button'
import { usePublishWidgetsFilters } from '../../model/hooks/usePublishWidgetsFilters'
import { ClientSelect, isUserAdmin } from '@/entities/User'
import { useSelector } from 'react-redux'

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
    const isMobile = useMediaQuery('(max-width:800px)')
    const isAdmin = useSelector(isUserAdmin)

    return (
        <VStack gap="16" max className={classNames(cls.PublishWidgetsListHeader, {}, [className])}>
            <HStack max justify="between" align="start" gap="16" wrap="wrap">
                <VStack gap="4">
                    <Text title={t('Виджеты')} size="l" bold />
                    <Text text={t('Управление и настройка виджетов для сайта')} size="s" variant="accent" />
                </VStack>

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

            <HStack max gap="12" wrap="wrap" className={cls.searchRow}>
                <Input
                    className={cls.searchInput}
                    placeholder={t('Поиск') ?? ''}
                    onChange={onSearchChange}
                    addonLeft={<Search size={18} className={cls.searchIcon} />}
                    value={search}
                />

                {isAdmin && (
                    <ClientSelect
                        clientId={clientId}
                        onChangeClient={onClientIdChange}
                        className={cls.clientSelect}
                        placeholder={t('Все клиенты') ?? 'Все клиенты'}
                    />
                )}
            </HStack>
        </VStack>
    )
})
