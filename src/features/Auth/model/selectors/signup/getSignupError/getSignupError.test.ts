import { StateSchema } from '@/app/providers/StoreProvider'
import { getSignupError } from './getSignupError'

describe('getLoginError.test', () => {
  test('should return error', () => {
    const state: DeepPartial<StateSchema> = {
      loginForm: {
        error: 'error',
        username: 'admin',
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
