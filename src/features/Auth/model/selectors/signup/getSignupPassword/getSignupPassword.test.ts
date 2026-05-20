import { StateSchema } from '@/app/providers/StoreProvider'
import { getSignupPassword } from './getSignupPassword'

describe('getSignupPassword', () => {
  test('should return password', () => {
    const state: DeepPartial<StateSchema> = {
      signupForm: {
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
