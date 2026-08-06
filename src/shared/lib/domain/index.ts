export {
    getDomainConfig,
    getApiBaseUrl,
    getWsUrl,
    getStaticUrl,
    getDomainOrigin,
    isPaymentOrganizationsTabVisible,
    isRuDomain,
    getTenantCurrencyCode,
} from './getDomainConfig'

export { getAipbxTelegramBot } from './getAipbxTelegramBot'
export type { AipbxTelegramBot } from './getAipbxTelegramBot'

export type { DomainConfig, PaymentSystem, TenantCurrencyCode } from './getDomainConfig'
