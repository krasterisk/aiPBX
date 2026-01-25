
/**
 * Функция преобразует секунды в HH:MM:SS
 * @param seconds: number
 * @param t
 */

export function formatTime(seconds: number, t: (key: string) => string) {
  const totalSeconds = Math.round(seconds)
  const hrs = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60

  const parts = []
  if (hrs > 0) parts.push(`${hrs} ${t('час')}`)
  if (mins > 0) parts.push(`${mins} ${t('мин')}`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs} ${t('сек')}`)

  return parts.join(' ')
}
