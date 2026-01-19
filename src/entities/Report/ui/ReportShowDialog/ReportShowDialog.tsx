import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportShowDialog.module.scss'
import React, { memo } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Divider } from '@/shared/ui/Divider'
import { Loader } from '@/shared/ui/Loader'
import { Text } from '@/shared/ui/redesigned/Text'
import { MediaPlayer } from '@/shared/ui/MediaPlayer'
import { Card } from '@/shared/ui/redesigned/Card'
import { ReportDialog } from '../../model/types/report'
import { useTranslation } from 'react-i18next'

interface ReportShowDialogProps {
  className?: string
  isDialogLoading: boolean
  isDialogError: boolean
  Dialogs?: ReportDialog[]
  mediaUrl: string
}

export const ReportShowDialog = memo((props: ReportShowDialogProps) => {
  const {
    className,
    Dialogs,
    isDialogLoading,
    isDialogError,
    mediaUrl
  } = props

  const { t } = useTranslation('reports')

  return (
    <VStack
      gap="24"
      className={classNames(cls.ReportShowDialog, {}, [className])}
      wrap={'wrap'}
    >
      <Divider />

      {isDialogLoading &&
        <HStack max justify={'center'}>
          <Loader />
        </HStack>
      }
      {isDialogError &&
        <HStack max justify={'center'}>
          <Text text={t('Ошибка при загрузке диалога')} variant="error" />
        </HStack>
      }
      {Dialogs?.length === 0
        ? <HStack max justify={'center'}>
          <Text text={t('Диалог отсутствует')} />
        </HStack>
        : <MediaPlayer src={mediaUrl} />
      }

      {Dialogs?.map((dialog, index) => (
        <HStack
          key={index}
          gap={'16'}
          justify={'between'} max
        >

          <VStack
            gap={'4'}
            justify={'start'}
          >
            <Text
              text={dialog.timestamp}
            />
            <Text
              text={dialog.role}
              variant={
                dialog.role === 'User'
                  ? 'accent'
                  : dialog.role === 'Assistant'
                    ? 'success'
                    : dialog.role === 'Function'
                      ? 'warning'
                      : 'error'
              }
              size={'m'}
            />
          </VStack>

          <Card border={'partial'} variant={
            dialog.role === 'User'
              ? 'outlined'
              : dialog.role === 'Assistant'
                ? 'success'
                : dialog.role === 'Function'
                  ? 'warning'
                  : 'warning'
          }>
            <Text text={dialog.text} />
          </Card>
        </HStack>
      ))}
    </VStack>
  )
})
