import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ContentList.module.scss'
import { memo } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { ContentView } from '../../model/types/content'
import { HStack } from '@/shared/ui/redesigned/Stack'

interface ContentListItemSkeletonProps {
  className?: string
  view?: ContentView
}

export const ContentListItemSkeleton = memo((props: ContentListItemSkeletonProps) => {
  const {
    className,
    view = 'SMALL'
  } = props

  const mainClass = cls.card

  if (view === 'BIG') {
    return (
            <div className={classNames(mainClass,
              {},
              [className, cls[view]])}
            >
                <Card className={cls.card} max>
                    <HStack className={cls.header}>
                        <Skeleton border='50%' width={30} height={30}/>
                        <Skeleton width={150} height={16} className={cls.username}/>
                        <Skeleton width={150} height={16} className={cls.date}/>
                    </HStack>
                    <HStack>
                        <Skeleton width={250} height={24} className={cls.title}/>
                        <Skeleton height={200} className={cls.img}/>
                    </HStack>
                </Card>
            </div>
    )
  }

  return (
        <HStack
            className={classNames(mainClass, {}, [className, cls[view]])}
            max
            wrap={'wrap'}
         >
            <Card className={cls.card} border={'partial'}>
                <HStack className={cls.imageWrapper}>
                    <Skeleton className={cls.img} width={200} height={200}/>
                    <HStack className={cls.infoWrapper}>
                        <Skeleton width={130} height={16}/>
                    </HStack>
                    <Skeleton width={150} height={16} className={cls.title}/>
                </HStack>
            </Card>
        </HStack>
  )
})
