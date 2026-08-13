import { initAssistant, type Assistant } from '@/entities/Assistants'

export function buildOnboardingAssistant (args: {
    name: string
    instruction: string
    userId?: string | number | null
}): Assistant {
    const { name, instruction, userId } = args
    const hasUserId = userId !== undefined && userId !== null && String(userId).trim() !== ''

    return {
        ...initAssistant,
        name,
        instruction,
        tools: [],
        userId: hasUserId ? String(userId) : undefined,
        user: undefined,
        id: undefined,
    }
}
