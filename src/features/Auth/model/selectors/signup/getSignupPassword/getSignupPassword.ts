import { StateSchema } from '@/app/providers/StoreProvider'

export const getSignupPassword = (state: StateSchema) => state?.loginForm?.password || ''
