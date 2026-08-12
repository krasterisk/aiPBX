import {
    filterAudioInputDevices,
    pickDefaultMicDeviceId,
    resolveMicDeviceIdForConnect,
    resolveMicDeviceOption,
    toMicDeviceOptions,
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

        expect(toMicDeviceOptions(devices)).toEqual([
            { deviceId: 'default', label: 'Microphone 1' },
            { deviceId: 'abc', label: 'USB Mic' },
        ])
    })

    it('picks browser default device id when present', () => {
        const options: MicDeviceOption[] = [
            { deviceId: 'abc', label: 'USB Mic' },
            { deviceId: 'default', label: 'Default' },
        ]
        expect(pickDefaultMicDeviceId(options)).toBe('default')
        expect(pickDefaultMicDeviceId([{ deviceId: 'only', label: 'Only' }])).toBe('only')
        expect(pickDefaultMicDeviceId([])).toBeNull()
    })

    it('resolves Combobox value to a concrete option (never empty when devices exist)', () => {
        const options: MicDeviceOption[] = [
            { deviceId: 'default', label: 'Default' },
            { deviceId: 'abc', label: 'USB Mic' },
        ]
        expect(resolveMicDeviceOption(options, null)?.deviceId).toBe('default')
        expect(resolveMicDeviceOption(options, 'abc')?.label).toBe('USB Mic')
        expect(resolveMicDeviceOption(options, 'missing')?.deviceId).toBe('default')
        expect(resolveMicDeviceOption([], null)).toBeNull()
    })

    it('passes selected device id into connect args when set', () => {
        expect(resolveMicDeviceIdForConnect('device-42')).toBe('device-42')
        expect(resolveMicDeviceIdForConnect(null)).toBeUndefined()
        expect(resolveMicDeviceIdForConnect('')).toBeUndefined()
        expect(resolveMicDeviceIdForConnect(undefined)).toBeUndefined()
    })
})
