export interface MicDeviceOption {
    deviceId: string
    label: string
}

/** Keep audioinput devices for Debug mic select (D-28). */
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
 * Session-scoped mic device id for connect(assistantId, micDeviceId?).
 * Empty / null → omit second arg (browser default).
 */
export function resolveMicDeviceIdForConnect (
    micDeviceId: string | null | undefined
): string | undefined {
    if (!micDeviceId) return undefined
    return micDeviceId
}
