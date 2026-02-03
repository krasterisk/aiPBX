import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishSipUrisItem.module.scss'
import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { getRoutePublishSipUrisEdit } from '@/shared/const/router'
import { Assistant } from '@/entities/Assistants'
import { Check } from '@/shared/ui/mui/Check'
import { Phone, Globe, Shield, Bot, Activity } from 'lucide-react'
import { PbxServer } from '@/entities/PbxServers'

interface PublishSipUrisItemProps {
    className?: string
    assistant: Assistant
    checkedItems?: string[]
    onChangeChecked?: (event: React.ChangeEvent<HTMLInputElement>) => void
    pbxServers?: PbxServer[]
}

export const PublishSipUrisItem = memo((props: PublishSipUrisItemProps) => {
    const { className, assistant, checkedItems, onChangeChecked, pbxServers } = props
    const { t } = useTranslation('publish-sip')
    const navigate = useNavigate()
    const [isExpanded, setIsExpanded] = useState(false)

    const server = pbxServers?.find(s => s.id === assistant.sipAccount?.pbxId)
    const sipDomain = server?.sip_host || assistant.sipAccount?.sipUri.split('@')[1] || 'aipbx.net'
    const serverName = server?.name || sipDomain
    const fullSipUri = assistant.uniqueId ? `sip:${assistant.uniqueId}@${sipDomain}` : assistant.sipAccount?.sipUri || ''

    const onCopy = useCallback((value: string) => (e: React.MouseEvent) => {
        e.stopPropagation()
        if (value) {
            navigator.clipboard.writeText(value)
            toast.success(t('Скопировано в буфер обмена'))
        }
    }, [t])

    const onOpenEdit = useCallback(() => {
        if (assistant.id) {
            navigate(getRoutePublishSipUrisEdit(assistant.id))
        }
    }, [assistant.id, navigate])

    const onCheckClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
    }, [])

    const toggleExpand = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setIsExpanded(prev => !prev)
    }, [])

    if (!assistant.sipAccount) return null

    const configCode = `[aipbx-trunk]
type=trunk
host=${sipDomain}
context=from-trunk
qualify=yes
outbound_proxy=sip:${sipDomain}
; SIP URI: ${fullSipUri}`

    return (
        <Card
            padding={'0'}
            max
            border={'partial'}
            variant={'outlined'}
            className={classNames(cls.PublishSipUrisItem, { [cls.expanded]: isExpanded }, [className])}
            onClick={onOpenEdit}
        >
            <VStack className={cls.content} max gap="12">
                <HStack max justify="between" align="center">
                    <div onClick={onCheckClick} className={cls.checkContainer}>
                        <Check
                            key={String(assistant.id)}
                            className={classNames('', {
                                [cls.uncheck]: !checkedItems?.includes(String(assistant.id)),
                                [cls.check]: checkedItems?.includes(String(assistant.id))
                            }, [])}
                            value={String(assistant.id)}
                            size={'small'}
                            checked={checkedItems?.includes(String(assistant.id))}
                            onChange={onChangeChecked}
                        />
                    </div>
                    <HStack gap="8">
                        {assistant.sipAccount.tls && (
                            <Text text="TLS/SRTP" size="xs" bold variant="accent" className={cls.chip} />
                        )}
                        {assistant.sipAccount.records && (
                            <div className={cls.chip}>
                                <div className={classNames(cls.dot, {}, [cls.records])} />
                                <Text text={t('REC')} size="xs" bold />
                            </div>
                        )}
                    </HStack>
                </HStack>

                <HStack gap={'16'} max align="center">
                    <div className={cls.avatar}>
                        <Bot size={24} />
                    </div>
                    <VStack max gap="4">
                        <Text title={assistant.name} size={'m'} bold className={cls.title} />
                        <HStack gap="8" align="center">
                            <div className={classNames(cls.statusDot, { [cls.inactive]: assistant.sipAccount?.active === false })} />
                            <Text
                                text={assistant.sipAccount?.active !== false ? t('Активен') : t('Неактивен')}
                                size="xs"
                                className={classNames(cls.statusText, { [cls.inactive]: assistant.sipAccount?.active === false })}
                            />
                        </HStack>
                    </VStack>
                </HStack>

                <div className={cls.divider} />

                <VStack gap="16" max className={cls.details}>
                    <HStack gap="12" align="start">
                        <div className={cls.detailIcon}>
                            <Phone size={14} />
                        </div>
                        <VStack max>
                            <Text text={t('SIP URI')} variant="accent" size="xs" />
                            <HStack gap="8" max align="start">
                                <Text text={fullSipUri} className={cls.urlText} />
                                <Button variant="clear" onClick={onCopy(fullSipUri)} className={cls.smallCopyBtn}>
                                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                                </Button>
                            </HStack>
                        </VStack>
                    </HStack>

                    <HStack gap="12" align="start">
                        <div className={cls.detailIcon}>
                            <Shield size={14} />
                        </div>
                        <VStack max>
                            <Text text={t('IP Адрес')} variant="accent" size="xs" />
                            <HStack gap="8" max align="start">
                                <Text text={assistant.sipAccount?.ipAddress} className={cls.urlText} />
                                <Button variant="clear" onClick={onCopy(assistant.sipAccount?.ipAddress || '')} className={cls.smallCopyBtn}>
                                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                                </Button>
                            </HStack>
                        </VStack>
                    </HStack>

                    <HStack gap="12" align="start">
                        <div className={cls.detailIcon}>
                            <Globe size={14} />
                        </div>
                        <VStack max>
                            <Text text={t('VoIP Сервер')} variant="accent" size="xs" />
                            <HStack gap="8" max align="start">
                                <Text text={serverName} className={cls.urlText} />
                                <Button variant="clear" onClick={onCopy(sipDomain)} className={cls.smallCopyBtn}>
                                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                                </Button>
                            </HStack>
                        </VStack>
                    </HStack>
                </VStack>

                <div className={cls.codeSection}>
                    <HStack justify="between" align="center" max onClick={toggleExpand} className={cls.codeHeader}>
                        <Text text={t('Конфигурация (Asterisk/PJSIP)')} size="s" bold />
                        <Button variant="clear" size="m">
                            <Text text={isExpanded ? t('Свернуть') : t('Развернуть')} size="xs" variant="accent" />
                        </Button>
                    </HStack>
                    {isExpanded && (
                        <VStack gap="8" max className={cls.codeContainer}>
                            <pre className={cls.codeBlock}>{configCode}</pre>
                            <Button
                                variant="outline"
                                size="m"
                                onClick={onCopy(configCode)}
                                className={cls.copyCodeBtn}
                            >
                                {t('Скопировать конфиг')}
                            </Button>
                        </VStack>
                    )}
                </div>
            </VStack>
        </Card>
    )
})
