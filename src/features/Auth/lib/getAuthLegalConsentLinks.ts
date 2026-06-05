import {
    getRouteLegal,
    getRouteLegalPersonalData,
    getRouteLegalPublicOffer,
} from '@/shared/const/router'
import { isRuDomain } from '@/shared/lib/domain'

export interface AuthLegalConsentLink {
    to: string
    labelKey: string
}

export type AuthLegalConsentConfig =
    | { variant: 'ru', links: [AuthLegalConsentLink, AuthLegalConsentLink] }
    | { variant: 'intl', link: AuthLegalConsentLink }

export function getAuthLegalConsentConfig (): AuthLegalConsentConfig {
    if (isRuDomain()) {
        return {
            variant: 'ru',
            links: [
                { to: getRouteLegalPublicOffer(), labelKey: 'Публичной оферты' },
                { to: getRouteLegalPersonalData(), labelKey: 'Политики обработки персональных данных' },
            ],
        }
    }

    return {
        variant: 'intl',
        link: { to: getRouteLegal(), labelKey: 'правовую информацию' },
    }
}

/** Shorter intro before a single /legal link on non-RU domains. */
export function getAuthLegalConsentIntroKey (introTextKey: string): string {
    if (!isRuDomain() && introTextKey === 'Регистрируясь, я принимаю условия') {
        return 'Регистрируясь, я принимаю'
    }
    return introTextKey
}

export function isLoginConsentRequired (): boolean {
    return isRuDomain()
}
