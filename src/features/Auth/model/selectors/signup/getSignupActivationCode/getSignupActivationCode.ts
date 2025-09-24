import { StateSchema } from '@/app/providers/StoreProvider'

export const getSignupActivationCode = (state: StateSchema) => state?.signupForm?.activationCode || ''
