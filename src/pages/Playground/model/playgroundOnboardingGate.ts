import { DisconnectInfo } from '@/features/PlaygroundSession'

/** Onboarding first-call gate — must stay ≥10s (PG-UX-08). */
export const MIN_CONNECTED_MS = 10_000

export function shouldRecordOnboardingCallSuccess (
    info: DisconnectInfo,
    isOnboardingAssistants: boolean
): boolean {
    if (!isOnboardingAssistants) return false
    if (!info.wasConnected) return false
    return info.connectedDurationMs >= MIN_CONNECTED_MS
}
