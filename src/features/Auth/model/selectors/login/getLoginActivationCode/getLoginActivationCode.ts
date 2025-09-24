import { StateSchema } from '@/app/providers/StoreProvider'

export const getLoginActivationCode = (state: StateSchema) => state?.loginForm?.activationCode || ''
