import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantsListHeader.module.scss'
import React, { memo } from 'react'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteAssistantCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { IconButton, useMediaQuery } from '@mui/material'
import AddBox from '@mui/icons-material/AddBox'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/redesigned/Input'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Text } from '@/shared/ui/redesigned/Text'
import { Plus, Search, Users } from 'lucide-react'
import { Button } from '@/shared/ui/redesigned/Button'
import { useAssistantFilters } from '../../lib/hooks/useAssistantFilters'
import { ClientSelect, isUserAdmin } from '@/entities/User'
import { useSelector } from 'react-redux'

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

    const { t } = useTranslation('assistants')
    const isMobile = useMediaQuery('(max-width:800px)')
    const isAdmin = useSelector(isUserAdmin)

    return (
        <VStack gap="16" max className={classNames(cls.AssistantsListHeader, {}, [className])}>
            <HStack max justify="between" align="start" gap="16" wrap="wrap">
                <VStack gap="4">
                    <Text title={t('Голосовые ассистенты')} size="l" bold />
                    <Text text={t('Управление вашими ИИ-лидностями и настройками голоса')} size="s" variant="accent" />
                </VStack>

                <AppLink to={getRouteAssistantCreate()}>
                    <Button
                        variant="outline"
                        className={cls.createBtn}
                        addonLeft={<Plus size={20} className={cls.plusIcon} />}
                    >
                        {t('Создать ассистента')}
                    </Button>
                </AppLink>
            </HStack>

            <HStack max gap="12" wrap="wrap" className={cls.searchRow}>
                <Input
                    data-testid={'AssistantSearch'}
                    className={cls.searchInput}
                    placeholder={t('Поиск') ?? ''}
                    onChange={onChangeSearch}
                    addonLeft={<Search size={18} className={cls.searchIcon} />}
                    value={search}
                />

                {isAdmin && (
                    <HStack gap="8" className={cls.clientSelectWrapper}>
                        <div className={cls.iconCircle}>
                            <Users size={18} className={cls.userIcon} />
                        </div>
                        <ClientSelect
                            clientId={clientId}
                            onChangeClient={onChangeUserId}
                            className={cls.clientSelect}
                        />
                    </HStack>
                )}
            </HStack>
        </VStack>
    )
})
