import { isPaymentOrganizationsTabVisible } from './getDomainConfig'

const setHostname = (hostname: string) => {
    Object.defineProperty(window, 'location', {
        value: { hostname },
        writable: true,
        configurable: true,
    })
}

describe('isPaymentOrganizationsTabVisible', () => {
    const originalLocation = window.location

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            value: originalLocation,
            writable: true,
            configurable: true,
        })
    })

    it('is true on aipbx.ru', () => {
        setHostname('aipbx.ru')
        expect(isPaymentOrganizationsTabVisible()).toBe(true)
    })

    it('is true on localhost in dev', () => {
        setHostname('localhost')
        expect(isPaymentOrganizationsTabVisible()).toBe(true)
    })

    it('is false on aipbx.net', () => {
        setHostname('aipbx.net')
        expect(isPaymentOrganizationsTabVisible()).toBe(false)
    })
})
