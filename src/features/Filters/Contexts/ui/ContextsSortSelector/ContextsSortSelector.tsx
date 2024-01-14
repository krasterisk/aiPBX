import { useTranslation } from 'react-i18next'
import { memo, useMemo } from 'react'
import { SelectOptions } from '@/shared/ui/deprecated/Select'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { ListBox } from '@/shared/ui/redesigned/Popups'
import { ContextSortField } from '@/entities/Pbx'

interface ContextsSortSelectorProps {
  className?: string
  sort: ContextSortField
  onChangeSort: (newSort: ContextSortField) => void

}

export const ContextsSortSelector = memo((props: ContextsSortSelectorProps) => {
  const {
    className,
    sort,
    onChangeSort
  } = props
  const { t } = useTranslation('endpoints')

  const sortFieldOptions = useMemo<Array<SelectOptions<ContextSortField>>>(() => [
    {
      value: ContextSortField.NAME,
      content: t('Имя')
    },
    {
      value: ContextSortField.DESCRIPTION,
      content: t('Описание')
    }
  ], [t])

  return (
        <div className={className}>
            <VStack gap={'8'}>
                <Text text={t('Сортировать по')}/>
                <ListBox
                    items={sortFieldOptions}
                    onChange={onChangeSort}
                    value={sort}
                />
            </VStack>
        </div>
  )
})
