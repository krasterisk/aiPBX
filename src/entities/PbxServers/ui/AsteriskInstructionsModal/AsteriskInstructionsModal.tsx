import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { CodeBlock } from '@/shared/ui/redesigned/CodeBlock/CodeBlock'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Card } from '@/shared/ui/redesigned/Card'
import CloseIcon from '@/shared/assets/icons/close.svg'
import InfoIcon from '@mui/icons-material/Info'
import NetworkIcon from '@mui/icons-material/NetworkCheck'
import CodeIcon from '@mui/icons-material/Code'
import cls from './AsteriskInstructionsModal.module.scss'

interface AsteriskInstructionsModalProps {
    isOpen: boolean
    onClose: () => void
}

export const AsteriskInstructionsModal = memo(({ isOpen, onClose }: AsteriskInstructionsModalProps) => {
    const { t } = useTranslation('pbx')

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
bindport = 8088
tlsenable = yes
tlsbindaddr = 0.0.0.0:8089
tlscertfile = /etc/asterisk/keys/asterisk.pem
tlsprivatekey = /etc/asterisk/keys/asterisk.pem`

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

    const dialplanConfig = `[assistant-in]
exten => 100,1,NoOp()
same => n,Set(__fname=/usr/records/assistants/\${UNIQUEID})
same => n,MixMonitor(\${fname}.wav)
same => n,Stasis(aiPBXBot,\${ASSISTANTID})
same => n,Hangup()`

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            lazy
            contentClassName={cls.modalWrapper}
        >
            <VStack
                className={cls.AsteriskInstructionsModal}
                max
                onClick={(e) => { e.stopPropagation() }}
            >
                <button className={cls.closeBtn} onClick={onClose}>
                    <Icon Svg={CloseIcon} className={cls.icon} />
                </button>

                <div className={cls.content}>
                    <div className={cls.header}>
                        <VStack gap="4" max>
                            <Text
                                title={t('Инструкции по настройке Asterisk')}
                                size={'l'}
                                bold
                            />
                            <Text
                                text={t('Используйте эти примеры конфигурации для настройки вашего Asterisk сервера')}
                                variant={'accent'}
                            />
                        </VStack>
                    </div>

                    <VStack gap="24" max>
                        <Card padding="24" max border="partial" className={cls.sectionCard}>
                            <VStack gap="16" max>
                                <HStack gap="12" align="center">
                                    <Icon Svg={CodeIcon} className={cls.icon} />
                                    <Text title={t('Настройка ARI (ari.conf)')} size="l" bold />
                                </HStack>
                                <Text
                                    text={t('Включите ARI и создайте пользователя в файле ari.conf:')}
                                    variant="accent"
                                />
                                <CodeBlock code={ariConfig} language="ini" />
                            </VStack>
                        </Card>

                        <Card padding="24" max border="partial" className={cls.sectionCard}>
                            <VStack gap="16" max>
                                <HStack gap="12" align="center">
                                    <Icon Svg={NetworkIcon} className={cls.icon} />
                                    <Text title={t('Настройка HTTP для WebRTC (http.conf)')} size="l" bold />
                                </HStack>
                                <Text
                                    text={t('Включите HTTP сервер для работы WebSocket в файле http.conf:')}
                                    variant="accent"
                                />
                                <CodeBlock code={httpConfig} language="ini" />
                            </VStack>
                        </Card>

                        <Card padding="24" max border="partial" className={cls.sectionCard}>
                            <VStack gap="16" max>
                                <HStack gap="12" align="center">
                                    <Icon Svg={InfoIcon} className={cls.icon} />
                                    <Text title={t('Настройка WSS и WebRTC (pjsip.conf)')} size="l" bold />
                                </HStack>
                                <Text
                                    text={t('Настройте транспорт и эндпоинт для работы через WebSocket в файле pjsip.conf:')}
                                    variant="accent"
                                />
                                <CodeBlock code={pjsipConfig} language="ini" />
                            </VStack>
                        </Card>

                        <Card padding="24" max border="partial" className={cls.sectionCard}>
                            <VStack gap="16" max>
                                <HStack gap="12" align="center">
                                    <Icon Svg={CodeIcon} className={cls.icon} />
                                    <Text title={t('Настройка Dialplan (extensions.conf)')} size="l" bold />
                                </HStack>
                                <Text
                                    text={t('Добавьте контекст для обработки входящих звонков через Stasis:')}
                                    variant="accent"
                                />
                                <CodeBlock code={dialplanConfig} language="ini" />
                                <Text
                                    text={t('ASSISTANTID можно получить на карточке ассистента:')}
                                    variant="accent"
                                />
                                <div className={cls.imagePlaceholder}>
                                    <Text text={t('Место для скриншота карточки ассистента')} variant="accent" />
                                </div>
                                <VStack gap="8" max className={cls.noteBox}>
                                    <Text
                                        text={t('Если необходима доступность записи разговоров из отчёта приложения AI PBX, вам необходимо обеспечить доступность файла с записью по адресу:')}
                                        size="s"
                                    />
                                    <CodeBlock code="https://{{PBX_ADDRESS}}/records/{{ASSISTANTID}}/{{UNIQUEID}}.{{FORMAT}}" />
                                    <VStack gap="4" max>
                                        <Text text={t('ASSISTANTID — ID ассистента в AI PBX')} size="s" />
                                        <Text text={t('UNIQUEID — уникальный идентификатор звонка Asterisk')} size="s" />
                                        <Text text={t('FORMAT — формат записи (указан в настройках сервера)')} size="s" />
                                    </VStack>
                                </VStack>
                            </VStack>
                        </Card>
                    </VStack>
                </div>
            </VStack>
        </Modal>
    )
})
