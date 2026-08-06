import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { getAipbxTelegramBot } from '@/shared/lib/domain'
import cls from './ProjectWizard.module.scss'

export const TelegramSetupHelp = memo(() => {
    const { t } = useTranslation('reports')
    const bot = getAipbxTelegramBot()
    const [open, setOpen] = useState(false)

    return (
        <VStack gap={'8'} max>
            <button
                type="button"
                className={cls.clickable}
                onClick={() => { setOpen(v => !v) }}
                style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    textAlign: 'left',
                    color: 'inherit',
                    width: '100%',
                }}
            >
                <HStack max justify={'between'} align={'center'}>
                    <Text text={String(t('TELEGRAM_SETUP_TITLE'))} bold size="xs" />
                    <Text text={open ? '▲' : '▼'} size="xs" />
                </HStack>
            </button>
            {open && (
                <VStack gap={'8'} max>
                    <HStack gap={'8'} align={'center'} wrap="wrap">
                        <Text text={String(t('TELEGRAM_SETUP_STEP1'))} size="xs" />
                        <a
                            href={bot.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cls.telegramBotLink}
                        >
                            {bot.displayName}
                        </a>
                    </HStack>
                    <Text text={String(t('TELEGRAM_SETUP_STEP2'))} size="xs" />
                    <Text text={String(t('TELEGRAM_SETUP_STEP3'))} size="xs" />
                    <Text text={String(t('TELEGRAM_SETUP_FAQ_PERSONAL'))} size="xs" />
                    <Text text={String(t('TELEGRAM_SETUP_FAQ_GROUP'))} size="xs" />
                    <Text text={String(t('TELEGRAM_SETUP_FAQ_START'))} size="xs" />
                    <Text text={String(t('TELEGRAM_SETUP_FAQ_DOMAIN'))} size="xs" />
                </VStack>
            )}
        </VStack>
    )
})
