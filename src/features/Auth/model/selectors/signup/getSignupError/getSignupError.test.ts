import { StateSchema } from '@/app/providers/StoreProvider'
import { getSignupError } from './getSignupError'

describe('getSignupError', () => {
  test('should return error', () => {
    const state: DeepPartial<StateSchema> = {
      signupForm: {
        error: 'error',
        email: 'user@test.com',
        password: '123'
      }
    }
    expect(getSignupError(state as StateSchema)).toEqual('error')
  })

  test('work with empty state', () => {
    const state: DeepPartial<StateSchema> = {}
    expect(getSignupError(state as StateSchema)).toEqual(undefined)
  })
})
