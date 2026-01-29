import { StateSchema } from '@/app/providers/StoreProvider'

export const getPublishSipUrisPageSearch = (state: StateSchema) => state.publishSipUrisPage?.search ?? ''
export const getPublishSipUrisPageInited = (state: StateSchema) => state.publishSipUrisPage?._inited
