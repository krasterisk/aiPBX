import { classNames } from '@/shared/lib/classNames/classNames'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { CommentCard } from '../../ui/CommentCard/CommentCard'
import { Text } from '@/shared/ui/redesigned/Text'
import { Comments } from '../../model/types/comments'
import { VStack } from '@/shared/ui/redesigned/Stack'

interface CommentListProps {
  className?: string
  comments?: Comments[]
  isLoading?: boolean
}

export const CommentList = memo((props: CommentListProps) => {
  const {
    className,
    comments,
    isLoading
  } = props
  const { t } = useTranslation()

  if (isLoading) {
    return (
            <VStack gap='16' max className={classNames('', {}, [className])}>
                <CommentCard isLoading />
                <CommentCard isLoading />
                <CommentCard isLoading />
            </VStack>
    )
  }

  return (
        <VStack gap={'8'} max className={classNames('', {}, [className])}>
            {comments?.length
              ? comments.map(comment => (
                    <CommentCard
                        isLoading={isLoading}
                        comment={comment}
                        key={comment.id}
                    />
              ))
              : (
                  <Text text={t('Пока нет комментариев')}/>
                )

            }
        </VStack>
  )
})
