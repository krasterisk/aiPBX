import { PbxServerOptions } from '@/entities/PbxServers'
import { AssistantOptions } from '@/entities/Assistants'

export type SipTrunkType = 'registration' | 'ip'
export type SipTransport = 'udp' | 'tcp' | 'tls'

export interface SipTrunkFormSchema {
    selectedAssistant: AssistantOptions | null
    selectedPbx: PbxServerOptions | null
    name: string
    trunkType: SipTrunkType
    sipServerAddress: string
    transport: SipTransport
    // Registration-based fields
    authName: string
    password: string
    domain: string
    // IP-based fields
    callerId: string
    providerIp: string
    // Common
    active: boolean
    records: boolean
    userId: string
    isLoading: boolean
    error?: string
}
