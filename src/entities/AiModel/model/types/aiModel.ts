export type RealtimeVendor = 'openai' | 'yandex' | 'qwen'

export const REALTIME_VENDORS: RealtimeVendor[] = ['openai', 'yandex', 'qwen']

export interface AiModel {
    id: number
    name: string
    publish: boolean
    publishName: string
    comment: string
    /** Realtime API adapter: openai | yandex | qwen */
    realtimeVendor?: RealtimeVendor | null
    /** Value for WebSocket ?model= (optional; Yandex may use env until set) */
    wireModelId?: string | null
    createdAt?: string
    updatedAt?: string
}

export interface CreateAiModelDto {
    name: string
    publish: boolean
    publishName: string
    comment: string
    realtimeVendor?: RealtimeVendor
    wireModelId?: string | null
}

export interface UpdateAiModelDto extends AiModel { }

export interface DeleteAiModelsDto {
    ids: number[]
}

/** Legacy prefix fallback - same rules as backend. */
export function inferRealtimeVendorFromName(name?: string | null): RealtimeVendor {
    const n = (name || '').toLowerCase()
    if (n.startsWith('yandex')) return 'yandex'
    if (n.startsWith('qwen')) return 'qwen'
    return 'openai'
}

export const EMPTY_AI_MODEL_FORM: CreateAiModelDto = {
    name: '',
    comment: '',
    publish: false,
    publishName: '',
    realtimeVendor: 'openai',
    wireModelId: '',
}

export function toAiModelForm(model: AiModel): CreateAiModelDto {
    return {
        name: model.name,
        comment: model.comment || '',
        publish: Boolean(model.publish),
        publishName: model.publishName || '',
        realtimeVendor: model.realtimeVendor || inferRealtimeVendorFromName(model.name),
        wireModelId: model.wireModelId || '',
    }
}
