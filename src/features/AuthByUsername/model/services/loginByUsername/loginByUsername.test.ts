import { loginByUsername } from './loginByUsername'
import { userActions } from '@/entities/User'
import { TestAsyncThunk } from '@/shared/lib/tests/TestAsyncThunk/TestAsyncThunk'

describe('loginByUsername.test', () => {
  test('success common', async () => {
    const thunk = new TestAsyncThunk(loginByUsername)
    const userToken = '12313123fasfsadfsdfsdfsdfsf'
    thunk.api.post.mockReturnValue(Promise.resolve({ data: userToken }))
    const result = await thunk.callThunk({
      email: 'admin@gmail.com',
      password: '123'
    })

    expect(thunk.dispatch).toHaveBeenCalledWith(userActions.setToken(userToken))
    expect(thunk.dispatch).toHaveBeenCalledTimes(3)
    expect(thunk.api.post).toHaveBeenCalled()
    expect(result.meta.requestStatus).toBe('fulfilled')
    expect(result.payload).toEqual(userToken)
  })

  test('invalid common', async () => {
    const thunk = new TestAsyncThunk(loginByUsername)
    thunk.api.post.mockReturnValue(Promise.resolve({ status: 403 }))
    const result = await thunk.callThunk({
      email: 'mail@gmail.com',
      password: '123'
    })

    expect(thunk.dispatch).toHaveBeenCalledTimes(2)

    expect(thunk.api.post).toHaveBeenCalled()
    expect(result.meta.requestStatus).toBe('rejected')
    expect(result.payload).toBe('error')
  })
})
