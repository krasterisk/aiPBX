import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './CommentCard.module.scss'
import { memo } from 'react'
import { Comments } from '../../model/types/comments'
import { Avatar as AvatarDeprecated } from '@/shared/ui/deprecated/Avatar'
import { Text as TextDeprecated } from '@/shared/ui/deprecated/Text'
import { Text } from '@/shared/ui/redesigned/Text'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { AppLink as AppLinkDeprecated } from '@/shared/ui/deprecated/AppLink'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { getRouteProfile } from '@/shared/const/router'
import { ToggleFeatures } from '@/shared/lib/features'
import { Card } from '@/shared/ui/redesigned/Card'

interface CommentCardProps {
  className?: string
  comment?: Comments
  isLoading?: boolean
}

export const CommentCard = memo((props: CommentCardProps) => {
  const { className, comment, isLoading } = props

  if (isLoading) {
    return (
            <ToggleFeatures
                feature={'isAppRedesigned'}
                on={
                    <VStack
                        data-testid={'CommentCard.Loading'}
                        gap='16'
                        max
                        className={classNames(cls.CommentCard, {}, [className, cls.loading])}
                    >
                        <div className={cls.header}>
                            <Skeleton width={30} height={30} border="50%"/>
                            <Skeleton width={100} height={16} className={cls.username}/>
                        </div>
                        <Skeleton width={'100%'} height={50} className={cls.text}/>
                    </VStack>

                }
                off={
                    <VStack
                        data-testid={'CommentCard.Loading'}
                        gap='8'
                        max
                        className={classNames(cls.CommentCard, {}, [className, cls.loading])}
                    >
                        <div className={cls.header}>
                            <Skeleton width={30} height={30} border="50%"/>
                            <Skeleton width={100} height={16} className={cls.username}/>
                        </div>
                        <Skeleton width={'100%'} height={50} className={cls.text}/>
                    </VStack>

                }
            />
    )
  }

  if (!comment) {
    return null
  }

  return (
        <ToggleFeatures
            feature={'isAppRedesigned'}
            on={
                <Card padding={'24'} border={'round'} max>
                    <VStack
                        data-testid={'CommentCard.Content'}
                        gap='8'
                        max
                        className={classNames(cls.CommentCardRedesigned, {}, [className])}
                    >
                        <AppLink to={getRouteProfile(comment.user.id)}>
                            <HStack gap={'8'} >
                                {comment.user.avatar ? <AvatarDeprecated size={30} src={comment.user.avatar}/> : null}
                                <Text text={comment.user.username} className={cls.username}/>
                            </HStack>
                        </AppLink>
                        <Text text={comment.text} className={cls.text} />
                    </VStack>
                </Card>
            }
            off={
                <VStack
                    data-testid={'CommentCard.Content'}
                    gap='8'
                    max
                    className={classNames(cls.CommentCard, {}, [className])}
                >
                    <AppLinkDeprecated to={getRouteProfile(comment.user.id)} className={cls.header}>
                        {comment.user.avatar ? <AvatarDeprecated size={30} src={comment.user.avatar}/> : null}
                        <TextDeprecated text={comment.user.username} className={cls.username}/>
                    </AppLinkDeprecated>
                    <TextDeprecated text={comment.text} className={cls.text}/>
                </VStack>
            }
        />
  )
})
