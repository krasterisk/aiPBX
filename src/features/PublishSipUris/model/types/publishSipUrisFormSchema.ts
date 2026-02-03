import { PbxServerOptions } from '@/entities/PbxServers'
import { AssistantOptions } from '@/entities/Assistants'

export interface PublishSipUrisFormSchema {
    selectedAssistant: AssistantOptions | null
    selectedPbx: PbxServerOptions | null
    ipAddress: string
    records: boolean
    tls: boolean
    active: boolean
    isLoading: boolean
    error?: string
}
