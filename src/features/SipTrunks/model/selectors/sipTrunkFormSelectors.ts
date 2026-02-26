import { StateSchema } from '@/app/providers/StoreProvider'

export const getSipTrunkFormSelectedAssistant = (state: StateSchema) => state.sipTrunkForm?.selectedAssistant
export const getSipTrunkFormSelectedPbx = (state: StateSchema) => state.sipTrunkForm?.selectedPbx
export const getSipTrunkFormName = (state: StateSchema) => state.sipTrunkForm?.name ?? ''
export const getSipTrunkFormTrunkType = (state: StateSchema) => state.sipTrunkForm?.trunkType ?? 'registration'
export const getSipTrunkFormSipServerAddress = (state: StateSchema) => state.sipTrunkForm?.sipServerAddress ?? ''
export const getSipTrunkFormTransport = (state: StateSchema) => state.sipTrunkForm?.transport ?? 'udp'
export const getSipTrunkFormAuthName = (state: StateSchema) => state.sipTrunkForm?.authName ?? ''
export const getSipTrunkFormPassword = (state: StateSchema) => state.sipTrunkForm?.password ?? ''
export const getSipTrunkFormDomain = (state: StateSchema) => state.sipTrunkForm?.domain ?? ''
export const getSipTrunkFormCallerId = (state: StateSchema) => state.sipTrunkForm?.callerId ?? ''
export const getSipTrunkFormProviderIp = (state: StateSchema) => state.sipTrunkForm?.providerIp ?? ''
export const getSipTrunkFormActive = (state: StateSchema) => state.sipTrunkForm?.active ?? true
export const getSipTrunkFormRecords = (state: StateSchema) => state.sipTrunkForm?.records ?? false
export const getSipTrunkFormUserId = (state: StateSchema) => state.sipTrunkForm?.userId ?? ''
export const getSipTrunkFormIsLoading = (state: StateSchema) => state.sipTrunkForm?.isLoading ?? false
export const getSipTrunkFormError = (state: StateSchema) => state.sipTrunkForm?.error
