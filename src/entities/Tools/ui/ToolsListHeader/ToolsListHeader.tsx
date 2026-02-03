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
import SearchIcon from '@/shared/assets/icons/search.svg'
import { useToolsFilters } from '../../lib/hooks/useToolsFilters'
import { ClientSelect, isUserAdmin } from '@/entities/User'
import { useSelector } from 'react-redux'
import { Plus } from 'lucide-react'

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
            <HStack max justify="between" align="center" gap="16" wrap="wrap">
                <VStack gap="4">
                    <Text title={t('Функции')} size="l" bold />
                    <Text text={t('Управление функциями и MCP серверами')} size="s" variant="accent" />
                </VStack>

                <HStack gap="12" wrap="wrap">
                    <Input
                        data-testid="ToolSearch"
                        className={cls.searchInput}
                        placeholder={t('Поиск') ?? ''}
                        size="s"
                        onChange={onChangeSearch}
                        addonLeft={<Icon Svg={SearchIcon} />}
                        value={search}
                    />

                    <AppLink to={getRouteToolsCreate()}>
                        <Button
                            variant="outline"
                            className={cls.createBtn}
                            addonLeft={<Plus size={18} />}
                        >
                            {t('Создать функцию')}
                        </Button>
                    </AppLink>
                </HStack>
            </HStack>

            {isAdmin && (
                <div className={cls.filtersSection}>
                    <ClientSelect
                        label={t('Клиент') || ''}
                        clientId={clientId}
                        onChangeClient={onChangeUserId}
                        className={cls.clientSelect}
                    />
                </div>
            )}
        </VStack>
    )
})
