
export function getErrorMessage (error: unknown): string {
  if (!error) return 'Undefined error'

  // RTK Query FetchBaseQueryError
  if (typeof error === 'object' && 'data' in (error as any)) {
    const data = (error as any).data

    if (!data) return 'Undefined error'

    // если data.message массив
    if (Array.isArray(data.message)) return data.message.join(', ')

    // если data.message строка
    if (typeof data.message === 'string') return data.message

    // fallback на data.error
    if (data.error) return String(data.error)

    // fallback на JSON
    return JSON.stringify(data)
  }

  // SerializedError { message }
  if (typeof error === 'object' && 'message' in (error as any)) {
    return (error as any).message
  }

  if (typeof error === 'string') return error

  return 'Undefined error'
}
