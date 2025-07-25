export enum UserRolesValues {
  ADMIN = 'ADMIN',
  USER = 'USER',
  CLIENT = 'CLIENT'
}

export enum UserSortField {
  NAME = 'name',
  EMAIL = 'email',
}

export enum UserCurrencyValues {
  USD = 'USD',
  RUB = 'RUB',
  EUR = 'EUR',
  CNY = 'CNY',
}

export const currencySymbols: Record<string, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
  CNY: '¥'
}

export const balanceWarnings: Record<string, number> = {
  RUB: 1400,
  USD: 10,
  EUR: 10,
  CNY: 100
}
