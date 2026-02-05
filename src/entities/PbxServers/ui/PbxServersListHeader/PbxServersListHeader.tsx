import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServersListHeader.module.scss'
import { memo } from 'react'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRoutePbxServerCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { Plus } from 'lucide-react'
import { usePbxServersFilters } from '../../lib/hooks/usePbxServersFilters'
import { ClientSelect, isUserAdmin } from '@/entities/User'
import { useSelector } from 'react-redux'
import { SearchInput } from '@/shared/ui/mui/SearchInput'

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
      <HStack max justify="between" align="center" gap="16" wrap="wrap">
        <VStack gap="4">
          <Text title={t('Серверы АТС')} size="l" bold />
          <Text text={t('Управление подключениями к АТС')} size="s" variant="accent" />
        </VStack>

        <HStack gap="16" wrap="nowrap" className={cls.headerActions}>
          <SearchInput
            data-testid={'PbxServerSearch'}
            className={cls.searchInput}
            placeholder={t('Поиск') ?? ''}
            onChange={onChangeSearch}
            value={search}
            fullWidth={false}
          />

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
      </HStack>

      {isAdmin && (
        <ClientSelect
          clientId={clientId}
          onChangeClient={onChangeUserId}
          placeholder={t('Все клиенты') ?? 'Все клиенты'}
        />
      )}
    </VStack>
  )
})
