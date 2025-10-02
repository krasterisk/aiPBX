import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit'

import { toast } from 'react-toastify'
import i18n from '@/shared/config/i18n/i18n' // тот же самый экземпляр, что и в useTranslation

export const toastMiddleware: Middleware = () => next => action => {
  if (isRejectedWithValue(action)) {
    const status = action?.payload?.status
    const message =
        action?.payload?.data?.message ||
        action?.error?.message ||
        'unknownError'

    // Исключение для 404
    if (status === 404 || status === 403) {
      return next(action)
    }

    // Пробуем найти перевод
    const translated = i18n.t(`${String(message)}`) || message

    toast.error(translated)
  }

  return next(action)
}
