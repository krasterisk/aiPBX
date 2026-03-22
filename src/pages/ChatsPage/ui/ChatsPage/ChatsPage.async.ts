import { lazy } from 'react'

export const ChatsPageAsync = lazy(async () => await import('./ChatsPage'))
