import { useEffect } from 'react'

declare global {
  interface Window {
    google: any
  }
}

export const useGoogleLogin = (onSuccess: (idToken: string) => void) => {
  useEffect(() => {
    if (!window.google) return

    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: __GOOGLE_CLIENT_ID__,
        callback: (response: any) => {
          if (response.credential) {
            onSuccess(response.credential) // это id_token
          }
        }
      })
    }
  }, [onSuccess])

  const login = () => {
    if (window.google) {
      window.google.accounts.id.prompt() // покажет всплывающее окно выбора аккаунта
    }
  }

  return login
}
