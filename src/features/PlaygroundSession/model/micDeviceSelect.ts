export interface MicDeviceOption {
    deviceId: string
    label: string
}

/** Keep audioinput devices for Call mic select. */
export function filterAudioInputDevices (devices: MediaDeviceInfo[]): MediaDeviceInfo[] {
    return devices.filter(d => d.kind === 'audioinput')
}

/** Map MediaDeviceInfo → Combobox options; unlabeled devices get Microphone N. */
export function toMicDeviceOptions (devices: MediaDeviceInfo[]): MicDeviceOption[] {
    return filterAudioInputDevices(devices).map((d, i) => ({
        deviceId: d.deviceId,
        label: d.label || `Microphone ${i + 1}`,
    }))
}

/**
 * Prefer browser `default` device, else first enumerated input.
 * Used so Call Combobox always shows a concrete selected mic.
 */
export function pickDefaultMicDeviceId (
    options: readonly MicDeviceOption[]
): string | null {
    if (!options.length) return null
    const browserDefault = options.find(o => o.deviceId === 'default')
    return (browserDefault ?? options[0]).deviceId
}

/**
 * Resolve Combobox value: match by id, else fall back to default pick.
 */
export function resolveMicDeviceOption (
    options: readonly MicDeviceOption[],
    micDeviceId: string | null | undefined
): MicDeviceOption | null {
    if (!options.length) return null
    if (micDeviceId) {
        const matched = options.find(o => o.deviceId === micDeviceId)
        if (matched) return matched
    }
    const fallbackId = pickDefaultMicDeviceId(options)
    return options.find(o => o.deviceId === fallbackId) ?? null
}

/**
 * Session-scoped mic device id for connect(assistantId, micDeviceId?).
 * Empty / null → omit second arg (browser default).
 */
export function resolveMicDeviceIdForConnect (
    micDeviceId: string | null | undefined
): string | undefined {
    if (!micDeviceId) return undefined
    return micDeviceId
}
