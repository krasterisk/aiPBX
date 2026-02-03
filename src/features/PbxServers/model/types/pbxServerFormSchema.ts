import { PbxServer } from '@/entities/PbxServers'

export interface PbxServerFormSchema {
    form: PbxServer
    isLoading: boolean
    error?: string
}
