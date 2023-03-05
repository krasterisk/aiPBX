import { LoginSchema } from 'features/AuthByUsername'
import { loginActions, loginReducer } from './loginSlice'

describe('loginSlice.test', () => {
    test('test set username', () => {
        const state: DeepPartial<LoginSchema> = { username: 'admin' }
        expect(loginReducer(
            state as LoginSchema,
            loginActions.setUsername('admin'))
        ).toStrictEqual({ username: 'admin' })
    })

    test('test set password', () => {
        const state: DeepPartial<LoginSchema> = { password: '123' }
        expect(loginReducer(
            state as LoginSchema,
            loginActions.setPassword('123'))
        ).toStrictEqual({ password: '123' })
    })
})
