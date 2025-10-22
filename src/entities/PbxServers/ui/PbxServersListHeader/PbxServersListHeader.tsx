import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServersListHeader.module.scss'
import React, { memo } from 'react'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRoutePbxServerCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { IconButton, useMediaQuery } from '@mui/material'
import AddBox from '@mui/icons-material/AddBox'
import { ContentViewSelector } from '../../../Content'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/redesigned/Input'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Text } from '@/shared/ui/redesigned/Text'
import SearchIcon from '@/shared/assets/icons/search.svg'
import { usePbxServersFilters } from '../../lib/hooks/usePbxServersFilters'
import { ClientSelect, isUserAdmin } from '@/entities/User'
import { useSelector } from 'react-redux'

interface PbxServersListHeaderProps {
  className?: string
}

export const PbxServersListHeader = memo((props: PbxServersListHeaderProps) => {
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
  } = usePbxServersFilters()

  const { t } = useTranslation('pbx')
  const isMobile = useMediaQuery('(max-width:800px)')
  const isAdmin = useSelector(isUserAdmin)

  return (
      <VStack max>
        <HStack
            className={classNames(cls.PbxServersListHeader, { [cls.mobileHeader]: isMobile }, [className])}
            justify={'between'}
            max
        >
          <HStack gap={'8'} justify={'start'}>
            <ContentViewSelector view={view} onViewClick={onChangeView}/>
            <Input
                data-testid={'PbxServerSearch'}
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
                title={String(t('Новый сервер'))}
                className={cls.CreateButton}
                to={getRoutePbxServerCreate()}
            >
              <IconButton>
                <AddBox className={cls.icon} fontSize={'large'}/>
                <Text text={t('Новый сервер')}/>
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
