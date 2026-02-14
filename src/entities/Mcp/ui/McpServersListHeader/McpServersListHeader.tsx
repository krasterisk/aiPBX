import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './McpServersListHeader.module.scss'
import { memo } from 'react'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteMcpServerCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Plus } from 'lucide-react'
import { useSelector } from 'react-redux'
import { ClientSelect, isUserAdmin } from '@/entities/User'
import { useMcpServersFilters } from '../../lib/hooks/useMcpServersFilters'
import { SearchInput } from '@/shared/ui/mui/SearchInput'

interface McpServersListHeaderProps {
    className?: string
}

export const McpServersListHeader = memo((props: McpServersListHeaderProps) => {
    const { className } = props
    const { t } = useTranslation('tools')
    const isAdmin = useSelector(isUserAdmin)

    const {
        search,
        clientId,
        onChangeUserId,
        onChangeSearch
    } = useMcpServersFilters()

    return (
        <VStack gap="16" max className={classNames(cls.McpServersListHeader, {}, [className])}>
            <HStack max justify="between" align="center" gap="16" wrap="wrap">
                <VStack gap="4">
                    <Text title={t('MCP Серверы')} size="l" bold />
                    <Text text={t('Управление MCP серверами')} size="s" variant="accent" />
                </VStack>

                <HStack gap="16" wrap="nowrap" className={cls.headerActions}>
                    <SearchInput
                        data-testid="McpServerSearch"
                        className={cls.searchInput}
                        placeholder={t('Поиск') ?? ''}
                        onChange={onChangeSearch}
                        value={search}
                        fullWidth={false}
                    />

                    <AppLink to={getRouteMcpServerCreate()}>
                        <Button
                            variant="outline"
                            className={cls.createBtn}
                            addonLeft={<Plus size={20} className={cls.plusIcon} />}
                        >
                            {t('Добавить MCP сервер')}
                        </Button>
                    </AppLink>
                </HStack>
            </HStack>

            {isAdmin && (
                <ClientSelect
                    clientId={clientId}
                    onChangeClient={onChangeUserId}
                />
            )}
        </VStack>
    )
})
