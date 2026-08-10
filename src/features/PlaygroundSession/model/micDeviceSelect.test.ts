import {
    filterAudioInputDevices,
    resolveMicDeviceIdForConnect,
    type MicDeviceOption,
} from './micDeviceSelect'

describe('micDeviceSelect (D-28)', () => {
    it('filters to audioinput devices only', () => {
        const devices = [
            { deviceId: 'm1', kind: 'audioinput', label: 'Mic A' },
            { deviceId: 's1', kind: 'audiooutput', label: 'Speaker' },
            { deviceId: 'm2', kind: 'audioinput', label: 'Mic B' },
            { deviceId: 'v1', kind: 'videoinput', label: 'Cam' },
        ] as MediaDeviceInfo[]

        const inputs = filterAudioInputDevices(devices)
        expect(inputs.map(d => d.deviceId)).toEqual(['m1', 'm2'])
    })

    it('maps devices to select options with fallback labels', () => {
        const devices = [
            { deviceId: 'default', kind: 'audioinput', label: '' },
            { deviceId: 'abc', kind: 'audioinput', label: 'USB Mic' },
        ] as MediaDeviceInfo[]

        const options: MicDeviceOption[] = filterAudioInputDevices(devices).map((d, i) => ({
            deviceId: d.deviceId,
            label: d.label || `Microphone ${i + 1}`,
        }))

        expect(options).toEqual([
            { deviceId: 'default', label: 'Microphone 1' },
            { deviceId: 'abc', label: 'USB Mic' },
        ])
    })

    it('passes selected device id into connect args when set', () => {
        expect(resolveMicDeviceIdForConnect('device-42')).toBe('device-42')
        expect(resolveMicDeviceIdForConnect(null)).toBeUndefined()
        expect(resolveMicDeviceIdForConnect('')).toBeUndefined()
        expect(resolveMicDeviceIdForConnect(undefined)).toBeUndefined()
    })
})
