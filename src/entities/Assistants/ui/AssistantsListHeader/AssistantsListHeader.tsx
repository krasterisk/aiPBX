import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantsListHeader.module.scss'
import React, { memo } from 'react'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteAssistantCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { IconButton, useMediaQuery } from '@mui/material'
import AddBox from '@mui/icons-material/AddBox'
import { ContentViewSelector } from '../../../Content'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/redesigned/Input'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Text } from '@/shared/ui/redesigned/Text'
import SearchIcon from '@/shared/assets/icons/search.svg'
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
    view,
    clientId,
    onChangeUserId,
    onChangeSearch,
    onChangeView
  } = useAssistantFilters()

  const { t } = useTranslation('assistants')
  const isMobile = useMediaQuery('(max-width:800px)')
  const isAdmin = useSelector(isUserAdmin)

  return (
        <VStack max>
            <HStack
                className={classNames(cls.AssistantsListHeader, { [cls.mobileHeader]: isMobile }, [className])}
                justify={'between'}
                max
            >
                <HStack gap={'8'} justify={'start'}>
                    <ContentViewSelector view={view} onViewClick={onChangeView}/>
                    <Input
                        data-testid={'AssistantSearch'}
                        className={cls.searchInput}
                        placeholder={t('Поиск') ?? ''}
                        size={'s'}
                        onChange={onChangeSearch}
                        addonLeft={<Icon Svg={SearchIcon}/>}
                        value={search}
                    />
                </HStack>
                <HStack>
                    <AppLink
                        title={String(t('Создать голосового ассистента'))}
                        className={cls.CreateButton}
                        to={getRouteAssistantCreate()}
                    >
                        <IconButton>
                            <AddBox className={cls.icon} fontSize={'large'}/>
                            <Text text={t('Создать ассистента')}/>
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
