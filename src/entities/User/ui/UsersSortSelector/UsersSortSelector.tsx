import { useTranslation } from 'react-i18next'
import { memo, useMemo } from 'react'
import { SelectOptions } from '@/shared/ui/deprecated/Select'
import { ListBox } from '@/shared/ui/redesigned/Popups'
import { UserSortField } from '../../model/consts/consts'
import { HStack } from '@/shared/ui/redesigned/Stack'

interface UsersSortSelectorProps {
  className?: string
  sort: UserSortField[]
  onChangeSort: (newSort: UserSortField) => void
}

export const UsersSortSelector = memo((props: UsersSortSelectorProps) => {
  const {
    className,
    sort,
    onChangeSort
  } = props
  const { t } = useTranslation('profile')

  const sortFieldOptions = useMemo<Array<SelectOptions<UserSortField>>>(() => [
    {
      value: UserSortField.NAME,
      content: t('Имя')
    },
    {
      value: UserSortField.EMAIL,
      content: t('Email')
    }
  ], [t])

  return (
      <HStack max>
          <ListBox
              items={sortFieldOptions}
              onChange={onChangeSort}
              value={sort}
          />
      </HStack>
  )
})
