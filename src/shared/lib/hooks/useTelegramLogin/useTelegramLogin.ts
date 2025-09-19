// shared/lib/hooks/useTelegramLogin/useTelegramLogin.ts
import { useCallback } from 'react'

declare global {
  interface Window {
    Telegram: {
      Login: {
        auth: (
          options: { bot_id: string, request_access: boolean },
          callback: (data: any) => void
        ) => void
      }
    }
  }
}

export const useTelegramLogin = (
  onSuccess: (data: any) => void,
  botId: string
) => {
  const login = useCallback(() => {
    if (!window.Telegram) {
      console.error('Telegram SDK not loaded')
      return
    }

    window.Telegram.Login.auth(
      { bot_id: botId, request_access: true },
      (data) => {
        if (data) {
          onSuccess(data)
        } else {
          console.error('Telegram authorization failed')
        }
      }
    )
  }, [onSuccess, botId])

  return login
}
