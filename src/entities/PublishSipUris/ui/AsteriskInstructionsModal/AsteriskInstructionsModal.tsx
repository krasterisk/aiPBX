import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { CodeBlock } from '@/shared/ui/redesigned/CodeBlock/CodeBlock'
import { Button } from '@/shared/ui/redesigned/Button'
import cls from './AsteriskInstructionsModal.module.scss'

interface AsteriskInstructionsModalProps {
    isOpen: boolean
    onClose: () => void
}

export const AsteriskInstructionsModal = memo(({ isOpen, onClose }: AsteriskInstructionsModalProps) => {
    const { t } = useTranslation('publish-sip')

    const ariConfig = `[general]
enabled = yes
pretty = yes

[username]
type = user
read_only = no
password = your_password
password_format = plain`

    const httpConfig = `[general]
enabled = yes
bindaddr = 0.0.0.0
bindport = 8088`

    const pjsipConfig = `[transport-wss]
type = transport
protocol = wss
bind = 0.0.0.0

[endpoint-name]
type = endpoint
context = from-external
disallow = all
allow = ulaw,alaw,opus
webrtc = yes
dtls_auto_self_generated = yes`

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            lazy
            contentClassName={cls.AsteriskInstructionsModal}
        >
            <VStack gap="24" max className={cls.container}>
                <Text title={t('Инструкции по настройке Asterisk')} size="l" bold />

                <VStack gap="12" max className={cls.section}>
                    <Text title={t('Настройка ARI (ari.conf)')} size="s" bold variant="accent" />
                    <Text text={t('Включите ARI и создайте пользователя в файле ari.conf:')} />
                    <CodeBlock code={ariConfig} language="ini" className={cls.codeBlock} />
                </VStack>

                <VStack gap="12" max className={cls.section}>
                    <Text title={t('Настройка HTTP для WebRTC (http.conf)')} size="s" bold variant="accent" />
                    <Text text={t('Включите HTTP сервер для работы WebSocket в файле http.conf:')} />
                    <CodeBlock code={httpConfig} language="ini" className={cls.codeBlock} />
                </VStack>

                <VStack gap="12" max className={cls.section}>
                    <Text title={t('Настройка WSS и WebRTC (pjsip.conf)')} size="s" bold variant="accent" />
                    <Text text={t('Настройте транспорт и эндпоинт для работы через WebSocket в файле pjsip.conf:')} />
                    <CodeBlock code={pjsipConfig} language="ini" className={cls.codeBlock} />
                </VStack>

                <HStack max justify="end">
                    <Button onClick={onClose} variant="outline" color="accent">
                        {t('Закрыть')}
                    </Button>
                </HStack>
            </VStack>
        </Modal>
    )
})
