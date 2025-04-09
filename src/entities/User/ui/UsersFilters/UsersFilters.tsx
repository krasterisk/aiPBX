import cls from './UsersFilters.module.scss'
import { memo } from 'react'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { useTranslation } from 'react-i18next'
import { Input } from '@/shared/ui/redesigned/Input'
import SearchIcon from '@/shared/assets/icons/search.svg'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { UserSortField } from '../../model/consts/consts'

interface UsersFiltersProps {
  className?: string
  sort: UserSortField
  search: string
  tab?: string
  onChangeSearch: (value: string) => void
  onChangeSort: (newSort: UserSortField) => void
  onChangeTab?: (tab: string) => void
}

export const UsersFilters = memo((props: UsersFiltersProps) => {
  const {
    search,
    onChangeSearch
  } = props

  const { t } = useTranslation('profile')

  return (
        <HStack>
            <Input
                data-testid={'UserSearch'}
                className={cls.searchInput}
                placeholder={t('Поиск') ?? ''}
                size={'s'}
                onChange={onChangeSearch}
                addonLeft={<Icon Svg={SearchIcon}/>}
                value={search}
            />
            {/* <UsersSortSelector */}
            {/*    sort={[sort]} */}
            {/*    onChangeSort={onChangeSort} */}
            {/* /> */}
        </HStack>
  )
})
