import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishSipUrisItem.module.scss'
import { memo, useCallback } from 'react'
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
import { Phone, Globe, Shield, Bot, User as UserIcon } from 'lucide-react'
import { PbxServer } from '@/entities/PbxServers'
import { useSelector } from 'react-redux'
import { isUserAdmin } from '@/entities/User'

interface PublishSipUrisItemProps {
    className?: string
    assistant: Assistant
    pbxServers?: PbxServer[]
}

export const PublishSipUrisItem = memo((props: PublishSipUrisItemProps) => {
    const { className, assistant, pbxServers } = props
    const { t } = useTranslation('publish-sip')
    const navigate = useNavigate()

    const sipAccount = assistant.sipAccount

    const server = pbxServers?.find(s => s.id === sipAccount?.pbxId)
    const sipDomain = server?.sip_host || sipAccount?.sipUri.split('@')[1] || 'aipbx.net'
    const location = server?.location || ''
    const fullSipUri = assistant.uniqueId ? `sip:${assistant.uniqueId}@${sipDomain}` : sipAccount?.sipUri || ''

    const isAdmin = useSelector(isUserAdmin)

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

    if (!sipAccount) return null

    return (
        <Card
            padding={'0'}
            max
            border={'partial'}
            variant={'outlined'}
            className={classNames(cls.PublishSipUrisItem, {}, [className])}
            onClick={onOpenEdit}
        >
            <VStack className={cls.content} max gap="12">
                <HStack max justify="end" align="center">
                    <HStack gap="8">
                        {sipAccount.tls && (
                            <Text text="TLS/SRTP" size="s" bold variant="accent" className={cls.chip} />
                        )}
                        {sipAccount.records && (
                            <div className={cls.chip}>
                                <div className={classNames(cls.dot, {}, [cls.records])} />
                                <Text text={t('REC')} size="s" bold />
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
                            <div className={classNames(cls.statusDot, { [cls.inactive]: sipAccount.active === false })} />
                            <Text
                                text={sipAccount.active !== false ? t('Активен') : t('Неактивен')}
                                size="s"
                                className={classNames(cls.statusText, { [cls.inactive]: sipAccount.active === false })}
                            />
                        </HStack>
                    </VStack>
                </HStack>

                <div className={cls.divider} />

                <VStack gap="16" max className={cls.details}>
                    {isAdmin && assistant.user?.name && (
                        <HStack gap="12" align="start">
                            <div className={cls.detailIcon}>
                                <UserIcon size={14} />
                            </div>
                            <VStack max>
                                <Text text={t('Клиент')} variant="accent" size="s" />
                                <Text text={assistant.user.name} className={cls.urlText} />
                            </VStack>
                        </HStack>
                    )}

                    <HStack gap="12" align="start">
                        <div className={cls.detailIcon}>
                            <Phone size={14} />
                        </div>
                        <VStack max>
                            <Text text={t('SIP URI')} variant="accent" size="s" />
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
                            <Text text={t('IP Адрес')} variant="accent" size="s" />
                            <HStack gap="8" max align="start">
                                <Text text={sipAccount.ipAddress || ''} className={cls.urlText} />
                            </HStack>
                        </VStack>
                    </HStack>

                    {server?.cloudPbx && (
                        <HStack gap="12" align="start">
                            <div className={cls.detailIcon}>
                                <Globe size={14} />
                            </div>
                            <VStack max>
                                <Text text={t('Локация')} variant="accent" size="s" />
                                <HStack gap="8" max align="start">
                                    <Text text={location} className={cls.urlText} />
                                </HStack>
                            </VStack>
                        </HStack>
                    )}
                </VStack>
            </VStack>
        </Card>
    )
})
