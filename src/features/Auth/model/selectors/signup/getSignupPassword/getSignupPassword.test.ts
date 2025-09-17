import { StateSchema } from '@/app/providers/StoreProvider'
import { getSignupPassword } from './getSignupPassword'

describe('getLoginPassword.test', () => {
  test('should return true', () => {
    const state: DeepPartial<StateSchema> = {
      loginForm: {
        password: '123'
      }
    }
    expect(getSignupPassword(state as StateSchema)).toEqual('123')
  })

  test('work with empty state', () => {
    const state: DeepPartial<StateSchema> = {}
    expect(getSignupPassword(state as StateSchema)).toEqual('')
  })
})
