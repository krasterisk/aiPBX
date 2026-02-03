import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServersListHeader.module.scss'
import React, { memo } from 'react'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRoutePbxServerCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { useMediaQuery } from '@mui/material'
import AddBox from '@mui/icons-material/AddBox'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/redesigned/Input'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Button } from '@/shared/ui/redesigned/Button'
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
    clientId,
    onChangeUserId,
    onChangeSearch
  } = usePbxServersFilters()

  const { t } = useTranslation('pbx')
  const isMobile = useMediaQuery('(max-width:800px)')
  const isAdmin = useSelector(isUserAdmin)

  return (
    <VStack max gap={'16'} className={classNames(cls.PbxServersListHeader, { [cls.mobileHeader]: isMobile }, [className])}>
      <HStack
        justify={'between'}
        max
        gap={'16'}
        wrap={isMobile ? 'wrap' : 'nowrap'}
      >
        <HStack gap={'8'} justify={'start'} max={isMobile}>
          <Input
            data-testid={'PbxServerSearch'}
            className={cls.searchInput}
            placeholder={t('Поиск') ?? ''}
            size={'s'}
            onChange={onChangeSearch}
            addonLeft={<Icon Svg={SearchIcon} />}
            value={search}
          />
        </HStack>
        <HStack max={isMobile} justify={'end'}>
          <AppLink
            to={getRoutePbxServerCreate()}
          >
            <Button
              variant={'clear'}
              addonLeft={<Icon Svg={AddBox} width={24} height={24} />}
            >
              {t('Новый сервер')}
            </Button>
          </AppLink>
        </HStack>
      </HStack>
      {isAdmin &&
        <ClientSelect
          label={t('Клиент') || ''}
          clientId={clientId}
          onChangeClient={onChangeUserId}
          fullWidth
        />
      }
    </VStack>
  )
})
