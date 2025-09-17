import { StateSchema } from '@/app/providers/StoreProvider'

export const getSignupEmail = (state: StateSchema) => state?.loginForm?.email || ''
