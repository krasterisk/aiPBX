/**
 * Функция преобразует дату из ISO 8601
 * @param dateStr: string
 */

export function formatDate (dateStr: string) {
  if (!dateStr) {
    return ''
  }
  const date = new Date(dateStr)
  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
    // timeZone: 'UTC', // или 'Europe/Moscow' для другого смещения
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date)

  return formattedDate
}

/**
 * Функция вычисляет разницу в днях между date1 и date2
 * @param firstDate: string
 * @param secondDate: string
 */

export function diffDates (firstDate: string, secondDate: string) {
  // Создание объектов Date
  const date1 = new Date(firstDate)
  const date2 = new Date(secondDate)

  // Вычисление разницы в миллисекундах
  const differenceInTime = date2.getTime() - date1.getTime()

  // Вычисление разницы в днях
  const differenceInDays = Math.round(differenceInTime / (1000 * 60 * 60 * 24))

  return differenceInDays
}
