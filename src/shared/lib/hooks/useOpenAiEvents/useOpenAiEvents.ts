import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { getWsUrl } from '../../domain'

const wsUrl = getWsUrl()
const socket = io(wsUrl)

interface Event {
  channelId: string
  eventId: string
  type: string
  userId: number
  [key: string]: any
}

export function useOpenAiEvents(userId: string) {
  const [eventMap, setEventMap] = useState<Map<string, Event[]>>(new Map())

  useEffect(() => {
    socket.emit('auth', userId)

    const handleEvent = (event: Event) => {
      setEventMap(prev => {
        const newMap = new Map(prev)

        console.log(event.channelId, event.type, event.userId)

        if (event.type === 'call.hangup') {
          newMap.delete(event.channelId)
        } else {
          const existing = newMap.get(event.channelId) || []
          newMap.set(event.channelId, [...existing, event])
        }

        return newMap
      })
    }

    socket.on('openai.event', handleEvent)

    return () => {
      socket.off('openai.event', handleEvent)
    }
  }, [userId])

  // Преобразуем Map в обычный объект
  const groupedEvents: Record<string, Event[]> = Object.fromEntries(eventMap)

  return groupedEvents
}
