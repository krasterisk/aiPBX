import { inferRealtimeVendorFromName, type RealtimeVendor } from '@/entities/AiModel'

export const GPT_VOICES = [
    'alloy', 'ash', 'ballad', 'cedar', 'coral', 'echo', 'sage', 'shimmer', 'marin', 'verse',
]

export const QWEN_VOICES = [
    'Cherry', 'Serena', 'Ethan', 'Chelsie', 'Momo', 'Vivian', 'Moon', 'Maia', 'Kai', 'Nofish',
    'Bella', 'Jennifer', 'Ryan', 'Katerina', 'Aiden', 'Eldric Sage', 'Mia', 'Mochi', 'Bellona',
    'Vincent', 'Bunny', 'Neil', 'Elias', 'Arthur', 'Nini', 'Ebona', 'Seren', 'Pip', 'Stella',
    'Bodega', 'Sonrisa', 'Alek', 'Dolce', 'Sohee', 'Ono Anna', 'Lenn', 'Emilien', 'Andre',
    'Radio Gol', 'Jada', 'Dylan', 'Li', 'Marcus', 'Roy', 'Peter', 'Sunny', 'Eric', 'Rocky', 'Kiki',
]

export const YANDEX_VOICES = [
    'alena', 'filipp', 'ermil', 'jane', 'omazh', 'zahar',
    'dasha', 'julia', 'lera', 'masha', 'marina',
    'alexander', 'kirill', 'anton',
    'madi_ru', 'saule_ru', 'zamira_ru', 'zhanar_ru', 'yulduz_ru',
]

export function resolveRealtimeVendor (
    modelName?: string | null,
    catalogVendor?: RealtimeVendor | null,
): RealtimeVendor {
    if (catalogVendor === 'openai' || catalogVendor === 'yandex' || catalogVendor === 'qwen') {
        return catalogVendor
    }
    return inferRealtimeVendorFromName(modelName)
}

export function getVoicesForRealtimeVendor (vendor: RealtimeVendor): string[] {
    switch (vendor) {
        case 'yandex':
            return YANDEX_VOICES
        case 'qwen':
            return QWEN_VOICES
        default:
            return GPT_VOICES
    }
}

export function getVoicesForRealtimeModel (
    modelName?: string | null,
    catalogVendor?: RealtimeVendor | null,
): string[] {
    return getVoicesForRealtimeVendor(resolveRealtimeVendor(modelName, catalogVendor))
}
