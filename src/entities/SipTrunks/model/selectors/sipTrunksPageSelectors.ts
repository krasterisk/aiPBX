import { StateSchema } from '@/app/providers/StoreProvider'

export const getSipTrunksPageSearch = (state: StateSchema) => state.sipTrunksPage?.search ?? ''
export const getSipTrunksPageClientId = (state: StateSchema) => state.sipTrunksPage?.clientId ?? ''
export const getSipTrunksPageInited = (state: StateSchema) => state.sipTrunksPage?._inited
