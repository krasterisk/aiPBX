import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'

export function getErrorMessage (error: FetchBaseQueryError | SerializedError | undefined): string {
  if (!error) return 'Ошибка'

  // Ошибка от RTK Query fetchBaseQuery
  if ('data' in error && error.data) {
    const data = error.data as any
    if (Array.isArray(data.message)) {
      return data.message.join('\n')
    } else if (typeof data.message === 'string') {
      return data.message
    }
  }

  // SerializedError или кастомные ошибки
  if ('message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Ошибка'
}
