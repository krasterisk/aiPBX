import { useEffect, useRef, useState } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import cls from './CallCard.module.scss'
import { useReportDialog } from '@/entities/Report'

interface CallCardProps {
  channelId: string
  callerId: string
  events: any[]
}

export const CallCard = ({ channelId, callerId, events }: CallCardProps) => {
  const [now, setNow] = useState(Date.now())
  const [showEvents, setShowEvents] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [expandedEventIds, setExpandedEventIds] = useState<Record<string, boolean>>({})

  const createdAtRef = useRef<number | null>(null)
  if (!createdAtRef.current && events.length > 0) {
    createdAtRef.current = Date.now()
  }

  useEffect(() => {
    const interval = setInterval(() => { setNow(Date.now()) }, 1000)
    return () => { clearInterval(interval) }
  }, [])

  const responseDoneEvent = [...events].reverse().find(e => e.type === 'response.done')
  const totalTokens = responseDoneEvent?.response?.usage?.total_tokens ?? 0

  const elapsedMs = createdAtRef.current ? now - createdAtRef.current : 0
  const minutes = Math.floor(elapsedMs / 60000)
  const seconds = Math.floor((elapsedMs % 60000) / 1000)
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const toggleEventJson = (eventId: string) => {
    setExpandedEventIds(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }))
  }

  // Собираем диалог
  const dialogMessages = useReportDialog(events)

  return (
      <Card variant="outlined" padding="16" border="round" className={cls.callCard}>
        <div className="text-white mb-2">
          <div><strong>📞 Channel:</strong> {channelId}</div>
          <div><strong>👤 Caller ID:</strong> {callerId}</div>
          <div><strong>⏱ Duration:</strong> {formattedTime}</div>
          <div><strong>🧠 Tokens used:</strong> {totalTokens}</div>

          <div className="mt-3 flex gap-2">
            <button
                onClick={() => { setShowEvents(prev => !prev) }}
                className="bg-gray-800 hover:bg-gray-700 text-sm px-3 py-1 rounded"
            >
              {showEvents ? 'Скрыть события' : 'Показать события'}
            </button>

            <button
                onClick={() => { setShowDialog(prev => !prev) }}
                className="bg-gray-800 hover:bg-gray-700 text-sm px-3 py-1 rounded"
            >
              {showDialog ? 'Скрыть диалог' : 'Показать диалог'}
            </button>
          </div>

          {showEvents && (
              <div className="mt-4 space-y-2">
                {events.map((event) => (
                    <div key={event.event_id}>
                      <div
                          onClick={() => { toggleEventJson(event.event_id) }}
                          className="cursor-pointer text-blue-400 hover:underline"
                      >
                        🧾 {event.type}
                      </div>
                      {expandedEventIds[event.event_id] && (
                          <pre className="bg-gray-900 text-green-400 text-xs mt-1 p-2 rounded overflow-x-auto">
                    {JSON.stringify(event, null, 2)}
                  </pre>
                      )}
                    </div>
                ))}
              </div>
          )}

          {showDialog && (
              <div className="mt-4 bg-gray-900 p-3 rounded space-y-2 text-sm">
                {dialogMessages.map((msg: any, idx: any) => (
                    <div key={idx}>
                <span className={msg.role === 'user' ? 'text-yellow-400' : 'text-cyan-400'}>
                  {msg.role === 'user' ? '🙍 Пользователь' : '🤖 Ассистент'}:
                </span>
                      <div className="whitespace-pre-line pl-4">{msg.text}</div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </Card>
  )
}
