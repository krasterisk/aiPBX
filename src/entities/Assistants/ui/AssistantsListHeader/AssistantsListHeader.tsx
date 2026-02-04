import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantsListHeader.module.scss'
import React, { memo, useCallback } from 'react'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteAssistantCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/shared/ui/redesigned/Button'
import { useAssistantFilters } from '../../lib/hooks/useAssistantFilters'
import { isUserAdmin, ClientSelect } from '@/entities/User'
import { useSelector } from 'react-redux'
import { Input } from '@/shared/ui/redesign-v3/Input'


interface AssistantsListHeaderProps {
    className?: string
}

export const AssistantsListHeader = memo((props: AssistantsListHeaderProps) => {
    const {
        className
    } = props

    const {
        search,
        clientId,
        onChangeUserId,
        onChangeSearch
    } = useAssistantFilters()

    const { t: _t } = { t: (key: string) => key } // Временная заглушка для переводов
    const isAdmin = useSelector(isUserAdmin)

    const handleClientChange = useCallback((newClientId: string) => {
        // Вызываем обработчик изменения с пустым event и объектом ClientOptions
        onChangeUserId?.(null, { id: newClientId, name: '' })
    }, [onChangeUserId])

    return (
        <VStack gap="16" max className={classNames(cls.AssistantsListHeader, {}, [className])}>
            <HStack max justify="between" align="start" gap="16" wrap="wrap">
                <VStack gap="4">
                    <Text title="Голосовые ассистенты" size="l" bold />
                    <Text text="Управление вашими ИИ-личностями и настройками голоса" size="s" variant="accent" />
                </VStack>

                <AppLink to={getRouteAssistantCreate()}>
                    <Button
                        variant="outline"
                        className={cls.createBtn}
                        addonLeft={<Plus size={20} className={cls.plusIcon} />}
                    >
                        Создать ассистента
                    </Button>
                </AppLink>
            </HStack>

            <HStack max gap="12" wrap="wrap" className={cls.searchRow}>
                <Input
                    data-testid={'AssistantSearch'}
                    className={cls.searchInput}
                    placeholder="Поиск"
                    onChange={onChangeSearch}
                    addonLeft={<Search size={18} className={cls.searchIcon} />}
                    value={search}
                    fullWidth={false}
                />

                {isAdmin && (
                    <ClientSelect
                        clientId={clientId}
                        onChangeClient={handleClientChange}
                        className={cls.clientSelect}
                        placeholder="Все клиенты"
                        size="m"
                    />
                )}
            </HStack>
        </VStack>
    )
})
