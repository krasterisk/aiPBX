import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ContentList.module.scss'
import { ContentView } from '../../model/types/content'
import { ContentListItemSkeleton } from './ContentListItemSkeleton'
import React, { HTMLAttributeAnchorTarget } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { User } from '../../../User'
import { UserItem } from '../../../User/ui/UserItem/UserItem'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Check } from '@/shared/ui/mui/Check'
import { Card } from '@/shared/ui/redesigned/Card'

interface ContentListProps<T extends object> {
  className?: string
  data: T[] | undefined
  isLoading?: boolean
  view?: ContentView
  target?: HTMLAttributeAnchorTarget
  componentName: string
}

const getSkeletons = (view: ContentView) => {
  return new Array(view === 'SMALL' ? 9 : 4)
    .fill(0)
    .map((item, index) => (
            <ContentListItemSkeleton className={cls.card} key={index} view={view}/>
    ))
}

export const ContentList = <T extends object>(props: ContentListProps<T>) => {
  const {
    className,
    data,
    isLoading,
    target,
    componentName,
    view = 'BIG'
  } = props

  const { t } = useTranslation()

  const renderContent = (content: T) => {
    if (componentName === 'users') {
      const user = content as User
      return (
                <UserItem
                    key={user.id}
                    user={user}
                    target={target}
                    view={view}
                    className={cls.caskItem}
                />
      )
    }
  }

  if (!isLoading && !data?.length) {
    return (
            <HStack
                justify={'start'}
                max
                className={classNames(cls.ContentList, {}, [className, cls[view]])}
            >
                <Text
                    align={'center'}
                    text={t('Данные не найдены')}
                />
            </HStack>
    )
  }

  return (
        <VStack
            className={classNames(cls.ContentList, {}, [className, cls[view]])}
            max
            gap={'16'}
        >
            <Card max border={'partial'}>
                <HStack gap={'4'} max wrap={'nowrap'}>
                    <Check indeterminate className={cls.checkAll} label={'Выбрать всё'}/>
                    <Text text={'Всего: ' + String(data?.length)}/>
                </HStack>
            </Card>

            {data?.length
              ? data.map(renderContent)
              : null
            }
            {isLoading && getSkeletons(view)}
        </VStack>
  )
}
