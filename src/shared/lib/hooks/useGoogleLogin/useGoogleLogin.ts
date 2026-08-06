import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    google: any
  }
}

const getGoogleClientId = () =>
  typeof __GOOGLE_CLIENT_ID__ === 'string' ? __GOOGLE_CLIENT_ID__.trim() : ''

export const useGoogleLogin = (onSuccess: (idToken: string) => void) => {
  const onSuccessRef = useRef(onSuccess)
  onSuccessRef.current = onSuccess

  useEffect(() => {
    const clientId = getGoogleClientId()
    if (!clientId) {
      if (__IS_DEV__) {
        // eslint-disable-next-line no-console
        console.error(
          '[Google Auth] GOOGLE_CLIENT_ID is empty. Set it in .env and restart the dev server.'
        )
      }
      return
    }

    let cancelled = false
    let pollId: number | undefined

    const initialize = () => {
      if (cancelled || !window.google?.accounts?.id) return false

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential?: string }) => {
          if (response.credential) {
            onSuccessRef.current(response.credential)
          }
        }
      })
      return true
    }

    if (!initialize()) {
      pollId = window.setInterval(() => {
        if (initialize() && pollId !== undefined) {
          window.clearInterval(pollId)
          pollId = undefined
        }
      }, 100)
    }

    return () => {
      cancelled = true
      if (pollId !== undefined) {
        window.clearInterval(pollId)
      }
    }
  }, [])

  return () => {
    const clientId = getGoogleClientId()
    if (!clientId) {
      if (__IS_DEV__) {
        // eslint-disable-next-line no-console
        console.error(
          '[Google Auth] Cannot prompt: GOOGLE_CLIENT_ID is empty.'
        )
      }
      return
    }

    if (!window.google?.accounts?.id) {
      if (__IS_DEV__) {
        // eslint-disable-next-line no-console
        console.error('[Google Auth] Google Identity Services script is not loaded.')
      }
      return
    }

    // One Tap / account chooser. If suppressed by the browser, GIS logs
    // skipped/not displayed - user may need to allow third-party sign-in.
    window.google.accounts.id.prompt()
  }
}
