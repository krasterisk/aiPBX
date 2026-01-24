import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolsListHeader.module.scss'
import React, { memo } from 'react'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteToolsCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { IconButton, useMediaQuery } from '@mui/material'
import AddBox from '@mui/icons-material/AddBox'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/redesigned/Input'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Text } from '@/shared/ui/redesigned/Text'
import SearchIcon from '@/shared/assets/icons/search.svg'
import { useToolsFilters } from '../../lib/hooks/useToolsFilters'
import { ClientSelect, isUserAdmin } from '@/entities/User'
import { useSelector } from 'react-redux'

interface ToolsListHeaderProps {
    className?: string
}

export const ToolsListHeader = memo((props: ToolsListHeaderProps) => {
    const {
        className
    } = props

    const {
        search,
        clientId,
        onChangeUserId,
        onChangeSearch
    } = useToolsFilters()

    const { t } = useTranslation('tools')
    const isMobile = useMediaQuery('(max-width:800px)')
    const isAdmin = useSelector(isUserAdmin)

    return (
        <VStack max>
            <HStack
                className={classNames(cls.ToolsListHeader, { [cls.mobileHeader]: isMobile }, [className])}
                justify={'between'}
                max
            >
                <HStack gap={'8'} justify={'start'}>
                    <Input
                        data-testid={'ToolSearch'}
                        className={cls.searchInput}
                        placeholder={t('Поиск') ?? ''}
                        size={'s'}
                        onChange={onChangeSearch}
                        addonLeft={<Icon Svg={SearchIcon} />}
                        value={search}
                    />

                </HStack>
                <HStack>
                    <AppLink
                        title={String(t('Создать функцию'))}
                        className={cls.CreateButton}
                        to={getRouteToolsCreate()}
                    >
                        <IconButton>
                            <AddBox className={cls.icon} fontSize={'large'} />
                            <Text text={t('Создать функцию')} />
                        </IconButton>
                    </AppLink>
                </HStack>
            </HStack>
            {isAdmin &&
                <ClientSelect
                    label={t('Клиент') || ''}
                    clientId={clientId}
                    onChangeClient={onChangeUserId}
                    className={cls.clientSelect}
                />
            }
        </VStack>
    )
})
