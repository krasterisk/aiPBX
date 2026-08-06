import { isRuDomain } from './getDomainConfig'

export interface AipbxTelegramBot {
    username: string
    displayName: string
    url: string
}

/** Domain-aware OA/Telegram bot: RU → @AIPBXRUbot, else @AIPBXbot. */
export function getAipbxTelegramBot (): AipbxTelegramBot {
    if (isRuDomain()) {
        return {
            username: 'AIPBXRUbot',
            displayName: '@AIPBXRUbot',
            url: 'https://t.me/AIPBXRUbot',
        }
    }
    return {
        username: 'AIPBXbot',
        displayName: '@AIPBXbot',
        url: 'https://t.me/AIPBXbot',
    }
}
