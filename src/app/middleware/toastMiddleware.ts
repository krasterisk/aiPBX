import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import i18n from '@/shared/config/i18n/i18n'

export const toastMiddleware: Middleware = (storeApi) => next => action => {
  if (isRejectedWithValue(action)) {
    // Don't show error toasts for unauthenticated users (landing page, login, signup)
    const state = storeApi.getState() 
    if (!state?.user?.authData) {
      return next(action)
    }

    const status: number | undefined = action?.payload?.status
    const message: string =
      action?.payload?.data?.message ||
      action?.error?.message ||
      'unknownError'

    if (
      status === 403 ||
      status === 404 ||
      message.includes('ERR_CONNECTION_REFUSED') ||
      message.includes('Network Error') ||
      message.includes('Failed to fetch')
    ) {
      return next(action)
    }

    // 🔤 Перевод ошибки (если есть)
    let translated = message

    if (i18n.exists(`errors.${translated}`)) {
      translated = i18n.t(`errors.${translated}`)
    } else if (status && i18n.exists(`errors.${status}`)) {
      translated = i18n.t(`errors.${status}`)
    } else if (i18n.exists(translated)) {
      translated = i18n.t(translated)
    }

    // 🔔 Показываем уведомление
    toast.error(translated)
  }

  return next(action)
}
