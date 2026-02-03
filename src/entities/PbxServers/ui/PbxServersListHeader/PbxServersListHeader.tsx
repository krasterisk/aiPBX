import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServersListHeader.module.scss'
import { memo } from 'react'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRoutePbxServerCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/redesigned/Input'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { Plus, Search, Users } from 'lucide-react'
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
  const isAdmin = useSelector(isUserAdmin)

  return (
    <VStack gap="16" max className={classNames(cls.PbxServersListHeader, {}, [className])}>
      <HStack max justify="between" align="start" gap="16" wrap="wrap">
        <VStack gap="4">
          <Text title={t('Серверы АТС')} size="l" bold />
          <Text text={t('Управление подключениями к телефонным серверам и их статусами')} size="s" variant="accent" />
        </VStack>

        <AppLink to={getRoutePbxServerCreate()}>
          <Button
            variant="outline"
            className={cls.createBtn}
            addonLeft={<Plus size={20} className={cls.plusIcon} />}
          >
            {t('Новый сервер')}
          </Button>
        </AppLink>
      </HStack>

      <HStack max gap="12" wrap="wrap" className={cls.searchRow}>
        <Input
          data-testid={'PbxServerSearch'}
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
