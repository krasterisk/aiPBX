import { StateSchema } from '@/app/providers/StoreProvider'

export const getSignupError = (state: StateSchema) => state?.signupForm?.error
