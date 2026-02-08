import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantsList.module.scss'
import React from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Assistant, AssistantsListProps } from '../../model/types/assistants'
import { AssistantsListHeader } from '../AssistantsListHeader/AssistantsListHeader'
import { ErrorGetData } from '../../../ErrorGetData'
import { ContentListItemSkeleton } from '../../../Content'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { AssistantItem } from '../AssistantItem/AssistantItem'

import { Icon } from '@/shared/ui/redesigned/Icon'
import SearchIcon from '@/shared/assets/icons/search.svg'

export const AssistantsList = (props: AssistantsListProps) => {
  const {
    className,
    isAssistantsError,
    isAssistantsLoading,
    assistants,
    target
  } = props

  const { t } = useTranslation('assistants')

  const getSkeletons = () => {
    return new Array(4)
      .fill(0)
      .map((item, index) => (
        <ContentListItemSkeleton className={cls.card} key={index} view={'BIG'} />
      ))
  }

  if (isAssistantsError) {
    return (
      <ErrorGetData />
    )
  }

  const renderContent = (assistant: Assistant) => {
    return (
      <AssistantItem
        key={assistant.id}
        assistant={assistant}
        view={'BIG'}
        target={target}
        className={cls.caskItem}
      />
    )
  }

  return (
    <VStack gap={'16'} max>
      <AssistantsListHeader />

      {assistants?.rows.length
        ? <HStack wrap={'wrap'} gap={'16'} align={'start'} max>
          {assistants.rows.map(renderContent)}
        </HStack>
        : <VStack justify={'center'} align={'center'} max className={cls.emptyState} gap={'16'}>
          <Icon Svg={SearchIcon} width={48} height={48} />
          <Text align={'center'} text={t('Данные не найдены')} size={'l'} bold />
          <Text align={'center'} text={t('У вас пока нет ассистентов') ?? 'У вас пока нет ассистентов'} />
        </VStack>
      }
      {isAssistantsLoading && getSkeletons()}
    </VStack>
  )
}
