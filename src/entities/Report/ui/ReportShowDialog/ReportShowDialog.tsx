import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportShowDialog.module.scss'
import React, { memo, useMemo } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Divider } from '@/shared/ui/Divider'
import { Loader } from '@/shared/ui/Loader'
import { Text } from '@/shared/ui/redesigned/Text'
import { MediaPlayer } from '@/shared/ui/MediaPlayer'
import { Card } from '@/shared/ui/redesigned/Card'
import { ReportDialog } from '../../model/types/report'
import { useTranslation } from 'react-i18next'
import { Code } from '@/shared/ui/redesigned/Code'

interface TranscriptionLine {
  speaker: 'operator' | 'customer'
  text: string
}

interface ReportShowDialogProps {
  className?: string
  isDialogLoading: boolean
  isDialogError: boolean
  Dialogs?: ReportDialog[]
  mediaUrl?: string
  transcription?: string
}

export const ReportShowDialog = memo((props: ReportShowDialogProps) => {
  const {
    className,
    Dialogs,
    isDialogLoading,
    isDialogError,
    mediaUrl,
    transcription
  } = props

  const { t } = useTranslation('reports')

  const parsedTranscription = useMemo<TranscriptionLine[] | null>(() => {
    if (!transcription) return null
    try {
      const parsed = JSON.parse(transcription)
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].speaker && parsed[0].text) {
        return parsed as TranscriptionLine[]
      }
    } catch { /* plain text fallback */ }
    return null
  }, [transcription])

  return (
    <VStack
      gap="24"
      className={classNames(cls.ReportShowDialog, {}, [className])}
      max
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
      {Dialogs?.length === 0 && !transcription
        ? <HStack max justify={'center'}>
          <Text text={t('Диалог отсутствует')} />
        </HStack>
        : mediaUrl ? <MediaPlayer src={mediaUrl} /> : null
      }

      {/* Structured transcription (new JSON format) */}
      {!Dialogs?.length && parsedTranscription && (
        <VStack gap="24" max>
          {parsedTranscription.map((line, i) => {
            const isOperator = line.speaker === 'operator'
            return (
              <HStack
                key={i}
                gap="16"
                justify="between"
                max
              >
                <VStack gap="4" justify="start">
                  <Text
                    text={isOperator ? t('Оператор') : t('Клиент')}
                    variant={isOperator ? 'accent' : 'warning'}
                    size="m"
                    bold
                  />
                </VStack>
                <Card
                  border="partial"
                  variant={isOperator ? 'outlined' : 'warning'}
                  style={{ flex: 1, minWidth: 0, width: '100%' }}
                >
                  <Text text={line.text} />
                </Card>
              </HStack>
            )
          })}
        </VStack>
      )}

      {/* Plain text transcription (legacy fallback) */}
      {!Dialogs?.length && transcription && !parsedTranscription && (
        <Card border={'partial'} variant={'outlined'} style={{ width: '100%' }}>
          <Text text={transcription} />
        </Card>
      )}

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

          <Card
            border={'partial'}
            variant={
              dialog.role === 'User'
                ? 'outlined'
                : dialog.role === 'Assistant'
                  ? 'success'
                  : dialog.role === 'Function'
                    ? 'warning'
                    : 'warning'
            }
            style={{ flex: 1, minWidth: 0, width: '100%' }}
          >
            {dialog.role === 'Function' || dialog.role === 'System'
              ? <Code text={dialog.text} />
              : <Text text={dialog.text} />
            }
          </Card>
        </HStack>
      ))}
    </VStack>
  )
})
