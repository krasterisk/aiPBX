import { memo } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './StatusPage.module.scss'
import { useOpenAiEvents } from '@/shared/lib/hooks/useOpenAiEvents/useOpenAiEvents'
import { useTranslation } from 'react-i18next'
import { CallCard } from '@/features/CallCard'

interface StatusPageProps {
  className?: string
}

export const StatusPage = memo((props: StatusPageProps) => {
  const { className } = props
  const { t } = useTranslation('main')
  const groupedEvents = useOpenAiEvents()

  return (
      <div className={classNames(cls.StatusPage, {}, [className])}>
        <div className="p-4 bg-black text-green-400 min-h-screen overflow-y-auto font-mono">
          <h3 className="text-lg mb-4">{t('Текущие звонки')}</h3>

          {Object.entries(groupedEvents).map(([channelId, events]) => {
            const firstEvent = events[0]
            return (
                <div key={channelId} className="mb-4">
                  <CallCard
                      channelId={channelId}
                      callerId={firstEvent.callerId}
                      events={events}
                  />
                </div>
            )
          })}
        </div>
      </div>
  )
})
