/**
 * Версии правовых документов и их контент-хэши.
 *
 * Используются для:
 *  - Отображения версии под формами согласия (SignupForm/LoginForm).
 *  - Передачи в `POST /api/legal-acceptances` и `POST /auth/login` / `POST /auth/register`,
 *    чтобы backend идемпотентно зафиксировал согласие конкретной редакции документа
 *    (PK = `(user_id, document_kind, document_version)`).
 *
 * Версия — дата последней редакции в формате `YYYY-MM-DD`.
 *
 * `contentHash` рассчитывается build-time скриптом `scripts/legal-hash.ts` (см. TODO),
 * который читает текст соответствующего .tsx, удаляет JSX-обвязку и считает SHA-256.
 * До внедрения build-step хэш равен версии (этого достаточно для идемпотентности по
 * PK, но не для верификации неизменности текста на стороне сервера).
 */

export type LegalDocumentKind = 'public_offer' | 'personal_data_policy'

export interface LegalDocumentVersion {
    kind: LegalDocumentKind
    version: string
    contentHash: string
}

export const PUBLIC_OFFER_VERSION: LegalDocumentVersion = {
    kind: 'public_offer',
    version: '2026-05-18',
    contentHash: '2026-05-18',
}

export const PERSONAL_DATA_POLICY_VERSION: LegalDocumentVersion = {
    kind: 'personal_data_policy',
    version: '2026-05-15',
    contentHash: '2026-05-15',
}

export const ALL_LEGAL_VERSIONS: LegalDocumentVersion[] = [
    PUBLIC_OFFER_VERSION,
    PERSONAL_DATA_POLICY_VERSION,
]

export function getLegalVersion(kind: LegalDocumentKind): LegalDocumentVersion {
    if (kind === 'public_offer') return PUBLIC_OFFER_VERSION
    return PERSONAL_DATA_POLICY_VERSION
}

/** Payload for `legalAcceptance` in auth API requests */
export interface LegalAcceptancePayloadItem {
    kind: LegalDocumentKind
    version: string
    contentHash: string
}

export function buildLegalAcceptanceItems(): LegalAcceptancePayloadItem[] {
    return ALL_LEGAL_VERSIONS.map((v) => ({
        kind: v.kind,
        version: v.version,
        contentHash: v.contentHash,
    }))
}
