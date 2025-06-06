import { StateSchema } from '@/app/providers/StoreProvider'

export const getLoginName = (state: StateSchema) => state?.loginForm?.name || ''
