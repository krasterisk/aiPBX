import { memo } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './StatusPage.module.scss'
import { useOpenAiEvents } from '@/shared/lib/hooks/useOpenAiEvents/useOpenAiEvents'
import { useTranslation } from 'react-i18next'
import { CallCard } from '@/features/CallCard'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'

interface StatusPageProps {
  className?: string
}

export const StatusPage = memo((props: StatusPageProps) => {
  const { className } = props
  const { t } = useTranslation('main')
  const groupedEvents = useOpenAiEvents()

  return (
      <VStack
          className={classNames(cls.StatusPage, {}, [className])}
          gap={'8'}
      >
          <Text text={t('Текущие звонки')} align={'center'} />

          {Object.entries(groupedEvents).map(([channelId, events]) => {
            const firstEvent = events[0]
            return (
                  <CallCard
                      key={channelId}
                      channelId={channelId}
                      callerId={firstEvent.callerId}
                      assistant={firstEvent.assistant}
                      events={events}
                  />
            )
          })}
        </VStack>
  )
})
