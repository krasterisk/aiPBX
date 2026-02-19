/**
 * Multi-domain configuration.
 *
 * The frontend is built once and can be deployed to any domain.
 * Domain-specific behavior (payment system, region, branding, etc.)
 * is determined at runtime via `window.location.hostname`.
 *
 * API base URL is always relative (`/api`) — nginx proxies it to the backend.
 */

export type PaymentSystem = 'stripe' | 'robokassa'

export interface DomainConfig {
    /** Payment system to use on this domain */
    paymentSystem: PaymentSystem
    /** Region code (for analytics, localization hints, etc.) */
    region: string
    /** Human-readable domain label (for UI, logs) */
    label: string
    /** WebSocket host override (if WS runs on a different host/port) */
    wsHost?: string
}

const DOMAIN_CONFIGS: Record<string, DomainConfig> = {
    'aipbx.net': {
        paymentSystem: 'stripe',
        region: 'eu',
        label: 'aiPBX EU',
    },
    'aipbx.ru': {
        paymentSystem: 'robokassa',
        region: 'ru',
        label: 'aiPBX RU',
    },
    'aipbx.org': {
        paymentSystem: 'stripe',
        region: 'US',
        label: 'aiPBX US',
    },
}

const DEFAULT_CONFIG: DomainConfig = {
    paymentSystem: 'stripe',
    region: 'eu',
    label: 'aiPBX',
}

/**
 * Returns domain-specific configuration based on the current hostname.
 * Works with both exact matches and subdomain fallback
 * (e.g. `app.aipbx.net` → `aipbx.net`).
 */
export function getDomainConfig(): DomainConfig {
    if (typeof window === 'undefined') return DEFAULT_CONFIG

    const hostname = window.location.hostname

    // Exact match first
    if (DOMAIN_CONFIGS[hostname]) {
        return DOMAIN_CONFIGS[hostname]
    }

    // Subdomain fallback: app.aipbx.net → aipbx.net
    const parts = hostname.split('.')
    if (parts.length > 2) {
        const rootDomain = parts.slice(-2).join('.')
        if (DOMAIN_CONFIGS[rootDomain]) {
            return DOMAIN_CONFIGS[rootDomain]
        }
    }

    return DEFAULT_CONFIG
}

/**
 * Returns the API base URL for the current domain.
 * Always relative — nginx handles proxying to the backend.
 */
export function getApiBaseUrl(): string {
    return '/api'
}

/**
 * Returns the WebSocket URL for the current domain.
 * Uses `__WS__` build-time variable if set (dev mode),
 * otherwise constructs from current hostname with wss:// protocol.
 */
export function getWsUrl(): string {
    // Build-time override (for local development)
    if (typeof __WS__ !== 'undefined' && __WS__) {
        return __WS__
    }
    // Runtime: derive from current domain
    if (typeof window !== 'undefined') {
        const config = getDomainConfig()
        if (config.wsHost) return config.wsHost

        const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        return `${proto}//${window.location.host}`
    }
    return '/'
}

/**
 * Returns the static files base URL for the current domain.
 * Uses `__STATIC__` build-time variable if set (dev mode),
 * otherwise uses relative `/static`.
 */
export function getStaticUrl(): string {
    if (typeof __STATIC__ !== 'undefined' && __STATIC__ && __STATIC__ !== '/static') {
        return __STATIC__
    }
    if (typeof window !== 'undefined') {
        return `${window.location.origin}/static`
    }
    return '/static'
}

/**
 * Returns the current domain's origin (e.g. `https://aipbx.net`).
 */
export function getDomainOrigin(): string {
    if (typeof window === 'undefined') return ''
    return window.location.origin
}
