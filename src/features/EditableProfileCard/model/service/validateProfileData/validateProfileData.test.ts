import { validateProfileData } from './validateProfileData'
import { Country } from '@/entities/Country'
import { Currency } from '@/entities/Currency'
import { ValidateProfileError } from '../../consts/consts'

const data = {
  firstname: 'First',
  lastname: 'Last',
  age: 19,
  username: 'Username',
  email: 'mail@email.com',
  country: Country.Russia,
  currency: Currency.RUB,
  id: '1'
}

describe('validateProfileData.test', () => {
  test('success', async () => {
    const result = validateProfileData(data)

    expect(result).toEqual([])
  })

  test('without firstname and lastname', async () => {
    const result = validateProfileData({ ...data, firstname: '', lastname: '' })

    expect(result).toEqual([
      ValidateProfileError.INCORRECT_USER_DATA
    ])
  })
  test('incorrect age', async () => {
    const result = validateProfileData({ ...data, age: undefined })

    expect(result).toEqual([
      ValidateProfileError.INCORRECT_USER_AGE
    ])
  })
  test('incorrect country', async () => {
    const result = validateProfileData({ ...data, country: undefined })

    expect(result).toEqual([
      ValidateProfileError.INCORRECT_COUNTRY
    ])
  })
  test('incorrect all', async () => {
    const result = validateProfileData({})

    expect(result).toEqual([
      ValidateProfileError.INCORRECT_USER_DATA,
      ValidateProfileError.INCORRECT_USER_AGE,
      ValidateProfileError.INCORRECT_COUNTRY
    ])
  })
})
