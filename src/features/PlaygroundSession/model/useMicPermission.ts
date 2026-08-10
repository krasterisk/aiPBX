import { useCallback, useEffect, useRef, useState } from 'react'

export type MicPermissionStatus =
    | 'unknown'
    | 'granted'
    | 'denied'
    | 'prompt'
    | 'unavailable'

export interface MicChecklistItem {
    status: 'ok' | 'denied' | 'pending'
    labelKey: string
    tooltipKey?: string
    showRetry?: boolean
}

export function resolveMicChecklistItem (permission: MicPermissionStatus): MicChecklistItem {
    switch (permission) {
        case 'granted':
            return { status: 'ok', labelKey: 'Микрофон готов' }
        case 'denied':
            return {
                status: 'denied',
                labelKey: 'Нет доступа к микрофону',
                tooltipKey: 'Откройте настройки сайта в браузере → Разрешения → Микрофон → Разрешить, затем нажмите «Повторить проверку».',
                showRetry: true,
            }
        case 'unavailable':
            return {
                status: 'denied',
                labelKey: 'Нет доступа к микрофону',
                tooltipKey: 'Откройте настройки сайта в браузере → Разрешения → Микрофон → Разрешить, затем нажмите «Повторить проверку».',
                showRetry: true,
            }
        case 'prompt':
        case 'unknown':
        default:
            return {
                status: 'pending',
                labelKey: 'Микрофон',
                showRetry: true,
            }
    }
}

export function isMicChecklistOk (permission: MicPermissionStatus): boolean {
    return permission === 'granted'
}

export function shouldDisableStartForMic (permission: MicPermissionStatus): boolean {
    return !isMicChecklistOk(permission)
}

async function queryMicPermission (): Promise<MicPermissionStatus> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        return 'unavailable'
    }

    try {
        const perms = navigator.permissions
        if (perms?.query) {
            const result = await perms.query({ name: 'microphone' as PermissionName })
            if (result.state === 'granted') return 'granted'
            if (result.state === 'denied') return 'denied'
            if (result.state === 'prompt') return 'prompt'
        }
    } catch {
        // Safari / unsupported — fall through to probe
    }

    return 'prompt'
}

/** Probe getUserMedia and stop tracks immediately (D-27 / Pitfall 4). */
export async function probeMicrophone (): Promise<MicPermissionStatus> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        return 'unavailable'
    }

    let stream: MediaStream | null = null
    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        return 'granted'
    } catch {
        const queried = await queryMicPermission()
        if (queried === 'denied') return 'denied'
        return 'denied'
    } finally {
        stream?.getTracks().forEach(t => { t.stop() })
    }
}

interface UseMicPermissionOptions {
    /** When true, proactively probe (e.g. after assistant select → Call). */
    enabled?: boolean
}

export function useMicPermission (options: UseMicPermissionOptions = {}) {
    const { enabled = true } = options
    const [permission, setPermission] = useState<MicPermissionStatus>('unknown')
    const probingRef = useRef(false)

    const check = useCallback(async () => {
        if (probingRef.current) return
        probingRef.current = true
        try {
            const queried = await queryMicPermission()
            if (queried === 'granted' || queried === 'denied' || queried === 'unavailable') {
                setPermission(queried)
                return
            }
            // prompt / unknown → proactive probe (D-27)
            const probed = await probeMicrophone()
            setPermission(probed)
        } finally {
            probingRef.current = false
        }
    }, [])

    useEffect(() => {
        if (!enabled) return
        void check()
    }, [enabled, check])

    const checklist = resolveMicChecklistItem(permission)

    return {
        permission,
        checklist,
        isOk: isMicChecklistOk(permission),
        startDisabled: shouldDisableStartForMic(permission),
        retry: check,
    }
}
