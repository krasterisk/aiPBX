import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io('ws://localhost:3033')

export function useOpenAiEvents () {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    socket.on('openai.event', (event) => {
      setEvents(prev => [...prev, event])
    })

    return () => {
      socket.off('openai.event')
    }
  }, [])

  return events
}
