import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'

export const toastMiddleware: Middleware = () => (next) => (action) => {
  // если RTK Query вернул reject (ошибка)
  if (isRejectedWithValue(action)) {
    const errorMsg = getErrorMessage(action.payload)
    toast.error(errorMsg)
  }

  return next(action)
}
