import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './StatusPage.module.scss'
import { memo } from 'react'
import { useOpenAiEvents } from '@/shared/lib/hooks/useOpenAiEvents/useOpenAiEvents'
import { useTranslation } from 'react-i18next'

interface StatusPageProps {
  className?: string
}

export const StatusPage = memo((props: StatusPageProps) => {
  const {
    className
  } = props
  const { t } = useTranslation('main')

  const events = useOpenAiEvents()

  return (
        <div className={classNames(cls.StatusPage, {}, [className])}>
            <div className="p-4 bg-black text-green-400 h-screen overflow-y-scroll font-mono">
                <h3 className="text-lg mb-4">
                    { t('Текущие звонки') }
                </h3>
                {events.map((e, idx) => (
                    <pre key={idx} className="mb-2 bg-gray-900 p-2 rounded">
          {JSON.stringify(e, null, 2)}
        </pre>
                ))}
            </div>
        </div>
  )
})
