import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantsListHeader.module.scss'
import { memo, useCallback } from 'react'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteAssistantCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/redesigned/Button'
import { useAssistantFilters } from '../../lib/hooks/useAssistantFilters'
import { isUserAdmin, ClientSelect } from '@/entities/User'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { SearchInput } from '@/shared/ui/mui/SearchInput'

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

    const isAdmin = useSelector(isUserAdmin)

    const handleClientChange = useCallback((newClientId: string) => {
        onChangeUserId?.(null, { id: newClientId, name: '' })
    }, [onChangeUserId])

    return (
        <VStack gap="16" max className={classNames(cls.AssistantsListHeader, {}, [className])}>
            <HStack max justify="between" align="center" gap="16" wrap="wrap">
                <VStack gap="4">
                    <Text title={t('Ассистенты')} size="l" bold />
                    <Text text={t('Настройка ваших ИИ-ассистентов')} size="s" variant="accent" />
                </VStack>

                <HStack gap="16" wrap="nowrap" className={cls.headerActions}>
                    <SearchInput
                        data-testid="ToolSearch"
                        className={cls.searchInput}
                        placeholder={t('Поиск') ?? ''}
                        onChange={onChangeSearch}
                        value={search}
                        fullWidth={false}
                    />

                    <AppLink to={getRouteAssistantCreate()}>
                        <Button
                            className={cls.createBtn}
                            addonLeft={<Plus size={20} className={cls.plusIcon} />}
                            variant="outline"
                        >
                            {t('Новый ассистент')}
                        </Button>
                    </AppLink>
                </HStack>
            </HStack>

            {isAdmin && (
                <ClientSelect
                    clientId={clientId}
                    onChangeClient={handleClientChange}
                />
            )}
        </VStack>
    )
})
