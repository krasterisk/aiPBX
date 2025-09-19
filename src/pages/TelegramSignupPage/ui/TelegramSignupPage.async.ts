import { lazy } from 'react'

export const TelegramPageAsync = lazy(async () => await import('./TelegramPage'))
