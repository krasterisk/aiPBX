import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UsersListHeader.module.scss'
import { memo, useCallback } from 'react'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteUserCreate } from '@/shared/const/router'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/redesigned/Button'
import { useUserFilters } from '../../lib/hooks/useUserFilters'
import { isUserAdmin } from '../../model/selectors/roleSelector'
import { ClientSelect } from '../ClientSelect/ClientSelect'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { SearchInput } from '@/shared/ui/mui/SearchInput'

interface UsersListHeaderProps {
  className?: string
  clientId?: string
  onChangeClient?: (clientId: string) => void
}

export const UsersListHeader = memo((props: UsersListHeaderProps) => {
  const {
    className,
    clientId,
    onChangeClient,
  } = props

  const {
    search,
    onChangeSearch
  } = useUserFilters()

  const { t } = useTranslation('users')

  const isAdmin = useSelector(isUserAdmin)

  const handleClientChange = useCallback((newClientId: string) => {
    onChangeClient?.(newClientId)
  }, [onChangeClient])

  return (
    <VStack gap="16" max className={classNames(cls.UsersListHeader, {}, [className])}>
      <HStack max justify="between" align="center" gap="16" wrap="wrap">
        <VStack gap="4">
          <Text title={t('Пользователи')} size="l" bold />
          <Text text={t('Управление пользователями')} size="s" variant="accent" />
        </VStack>

        <HStack gap="16" wrap="nowrap" className={cls.headerActions}>
          <SearchInput
            data-testid="UserSearch"
            className={cls.searchInput}
            placeholder={t('Поиск') ?? ''}
            onChange={onChangeSearch}
            value={search}
            fullWidth={false}
          />

          <AppLink to={getRouteUserCreate()}>
            <Button
              className={cls.createBtn}
              addonLeft={<Plus size={20} className={cls.plusIcon} />}
              variant="outline"
            >
              {t('Новый пользователь')}
            </Button>
          </AppLink>
        </HStack>
      </HStack>

      {isAdmin && onChangeClient && (
        <ClientSelect
          clientId={clientId}
          onChangeClient={handleClientChange}
        />
      )}
    </VStack>
  )
})
