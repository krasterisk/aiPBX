import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './SipTrunksListHeader.module.scss'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteSipTrunkCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/redesigned/Button'
import { useSipTrunksFilters } from '../../model/hooks/useSipTrunksFilters'
import { SearchInput } from '@/shared/ui/mui/SearchInput'
import { useSelector } from 'react-redux'
import { isUserAdmin, ClientSelect } from '@/entities/User'

interface SipTrunksListHeaderProps {
    className?: string
}

export const SipTrunksListHeader = memo((props: SipTrunksListHeaderProps) => {
    const { className } = props
    const { t } = useTranslation('sip-trunks')
    const isAdmin = useSelector(isUserAdmin)

    const {
        search,
        onSearchChange,
        clientId,
        onClientIdChange
    } = useSipTrunksFilters()

    return (
        <VStack gap="16" max className={classNames(cls.SipTrunksListHeader, {}, [className])}>
            <HStack max justify="between" align="center" gap="16" wrap="wrap">
                <VStack gap="4">
                    <Text title={t('SIP Trunks')} size="l" bold />
                    <Text text={t('Настройка SIP транков для маршрутизации звонков на AI Ассистента')} size="s" variant="accent" />
                </VStack>

                <HStack gap="16" wrap="nowrap" className={cls.headerActions}>
                    <SearchInput
                        className={cls.searchInput}
                        placeholder={t('Поиск') ?? ''}
                        onChange={onSearchChange}
                        value={search}
                        fullWidth={false}
                    />

                    <AppLink to={getRouteSipTrunkCreate()}>
                        <Button
                            variant="outline"
                            className={cls.createBtn}
                            addonLeft={<Plus size={20} className={cls.plusIcon} />}
                        >
                            {t('Создать SIP Trunk')}
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
