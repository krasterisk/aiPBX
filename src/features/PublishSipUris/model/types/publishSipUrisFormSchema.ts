import { PbxServerOptions } from '@/entities/PbxServers'
import { AssistantOptions } from '@/entities/Assistants'

export interface PublishSipUrisFormSchema {
    selectedAssistant: AssistantOptions | null
    selectedPbx: PbxServerOptions | null
    ipAddress: string
    isLoading: boolean
    error?: string
}
