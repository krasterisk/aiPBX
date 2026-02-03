import { StateSchema } from '@/app/providers/StoreProvider'

export const getPbxServerForm = (state: StateSchema) => state.pbxServerForm?.form
export const getPbxServerFormIsLoading = (state: StateSchema) => state.pbxServerForm?.isLoading
export const getPbxServerFormError = (state: StateSchema) => state.pbxServerForm?.error
