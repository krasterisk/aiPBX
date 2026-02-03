import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishSipUrisListHeader.module.scss'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRoutePublishSipUrisCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { IconButton, useMediaQuery } from '@mui/material'
import AddBox from '@mui/icons-material/AddBox'
import { Input } from '@/shared/ui/redesigned/Input'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Text } from '@/shared/ui/redesigned/Text'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/shared/ui/redesigned/Button'
import { usePublishSipUrisFilters } from '../../model/hooks/usePublishSipUrisFilters'

interface PublishSipUrisListHeaderProps {
    className?: string
}

export const PublishSipUrisListHeader = memo((props: PublishSipUrisListHeaderProps) => {
    const { className } = props
    const { t } = useTranslation('publish-sip')
    const isMobile = useMediaQuery('(max-width:800px)')

    const {
        search,
        onSearchChange
    } = usePublishSipUrisFilters()

    return (
        <VStack gap="16" max className={classNames(cls.PublishSipUrisListHeader, {}, [className])}>
            <HStack max justify="between" align="start" gap="16" wrap="wrap">
                <VStack gap="4">
                    <Text title={t('SIP URI')} size="l" bold />
                    <Text text={t('Настройка входящей связи через SIP протокол')} size="s" variant="accent" />
                </VStack>

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

            <HStack max gap="12" wrap="wrap" className={cls.searchRow}>
                <Input
                    className={cls.searchInput}
                    placeholder={t('Поиск') ?? ''}
                    onChange={onSearchChange}
                    addonLeft={<Search size={18} className={cls.searchIcon} />}
                    value={search}
                />
            </HStack>
        </VStack>
    )
})
