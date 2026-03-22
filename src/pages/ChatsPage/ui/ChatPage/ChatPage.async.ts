import { lazy } from 'react'

export const ChatPageAsync = lazy(async () => await import('./ChatPage'))
