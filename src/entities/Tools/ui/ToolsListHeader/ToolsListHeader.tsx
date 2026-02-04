import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolsListHeader.module.scss'
import { memo } from 'react'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteToolsCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/redesigned/Input'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Plus, Search } from 'lucide-react'
import { useSelector } from 'react-redux'
import { ClientSelect, isUserAdmin } from '@/entities/User'
import { useToolsFilters } from '../../lib/hooks/useToolsFilters'

interface ToolsListHeaderProps {
    className?: string
}

export const ToolsListHeader = memo((props: ToolsListHeaderProps) => {
    const { className } = props
    const { t } = useTranslation('tools')
    const isMobile = useMediaQuery('(max-width:800px)')
    const isAdmin = useSelector(isUserAdmin)

    const {
        search,
        clientId,
        onChangeUserId,
        onChangeSearch
    } = useToolsFilters()

    return (
        <VStack gap="16" max className={classNames(cls.ToolsListHeader, {}, [className])}>
            <HStack max justify="between" align="start" gap="16" wrap="wrap">
                <VStack gap="4">
                    <Text title={t('Функции')} size="l" bold />
                    <Text text={t('Управление функциями и MCP серверами')} size="s" variant="accent" />
                </VStack>

                <AppLink to={getRouteToolsCreate()}>
                    <Button
                        variant="outline"
                        className={cls.createBtn}
                        addonLeft={<Plus size={20} className={cls.plusIcon} />}
                    >
                        {t('Создать функцию')}
                    </Button>
                </AppLink>
            </HStack>

            <HStack max gap="12" wrap="wrap" className={cls.searchRow}>
                <Input
                    data-testid="ToolSearch"
                    className={cls.searchInput}
                    placeholder={t('Поиск') ?? ''}
                    onChange={onChangeSearch}
                    addonLeft={<Search size={18} className={cls.searchIcon} />}
                    value={search}
                />

                {isAdmin && (
                    <ClientSelect
                        clientId={clientId}
                        onChangeClient={onChangeUserId}
                        className={cls.clientSelect}
                    />
                )}
            </HStack>
        </VStack>
    )
})
