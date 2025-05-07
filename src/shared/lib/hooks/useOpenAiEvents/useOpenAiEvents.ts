import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io('ws://192.168.2.37:3033')

interface Event {
  channelId: string
  event_id: string
  type: string
  [key: string]: any
}

export function useOpenAiEvents () {
  const [eventMap, setEventMap] = useState<Map<string, Event[]>>(new Map())

  useEffect(() => {
    const handleEvent = (event: Event) => {
      setEventMap(prev => {
        const newMap = new Map(prev)

        console.log(event.channelId, event.type)

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
  }, [])

  // Преобразуем Map в обычный объект
  const groupedEvents: Record<string, Event[]> = Object.fromEntries(eventMap)

  return groupedEvents
}
