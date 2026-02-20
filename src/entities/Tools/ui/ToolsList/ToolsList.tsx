import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolsList.module.scss'
import React, { memo } from 'react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { ToolsListProps } from '../../model/types/tools'
import { ToolsListHeader } from '../ToolsListHeader/ToolsListHeader'
import { ErrorGetData } from '../../../ErrorGetData'
import { ContentListItemSkeleton } from '../../../Content'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { ToolItem } from '../ToolItem/ToolItem'
import { Icon } from '@/shared/ui/redesigned/Icon'
import SearchIcon from '@/shared/assets/icons/search.svg'

export const ToolsList = memo((props: ToolsListProps) => {
  const {
    className,
    isToolsError,
    isToolsLoading,
    tools,
    onRefetch
  } = props

  const { t } = useTranslation('tools')

  const getSkeletons = () => {
    return new Array(4)
      .fill(0)
      .map((_, index) => (
        <ContentListItemSkeleton className={cls.card} key={index} view={'BIG'} />
      ))
  }

  if (isToolsError) {
    return <ErrorGetData onRefetch={onRefetch} />
  }

  return (
    <VStack gap="16" max className={classNames(cls.ToolsList, {}, [className])}>
      <ToolsListHeader />

      {tools?.rows.length
? (
        <div className={cls.listWrapper}>
          {tools.rows.map((tool) => (
            <ToolItem
              key={tool.id}
              tool={tool}
            />
          ))}
        </div>
      )
: (
        <VStack justify="center" align="center" max className={cls.emptyState} gap="16">
          <Icon Svg={SearchIcon} width={48} height={48} />
          <Text align="center" text={t('Данные не найдены')} size="l" bold />
          <Text align="center" text={t('У вас пока нет активных функций')} />
        </VStack>
      )}

      {isToolsLoading && (
        <div className={cls.listWrapper}>
          {getSkeletons()}
        </div>
      )}
    </VStack>
  )
})
