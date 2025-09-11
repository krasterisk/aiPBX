import { StateSchema } from '@/app/providers/StoreProvider'

export const getActivationCode = (state: StateSchema) => state?.loginForm?.activationCode || ''
