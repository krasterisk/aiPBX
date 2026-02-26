import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './SipTrunksItem.module.scss'
import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { useNavigate } from 'react-router-dom'
import { getRouteSipTrunkEdit } from '@/shared/const/router'
import { PhoneForwarded, Server, User as UserIcon } from 'lucide-react'
import { useSelector } from 'react-redux'
import { isUserAdmin } from '@/entities/User'
import { SipTrunk } from '../../api/sipTrunksApi'
import { useSipTrunkStatus } from '../../api/sipTrunksApi'

interface SipTrunksItemProps {
    className?: string
    trunk: SipTrunk
}

export const SipTrunksItem = memo((props: SipTrunksItemProps) => {
    const { className, trunk } = props
    const { t } = useTranslation('sip-trunks')
    const navigate = useNavigate()
    const isAdmin = useSelector(isUserAdmin)

    const { data: trunkStatus } = useSipTrunkStatus(String(trunk.id), {
        pollingInterval: 30000,
        skip: !trunk.id
    })

    const isRegistered = trunkStatus?.registered ?? false
    const statusText = isRegistered ? t('Зарегистрирован') : t('Не зарегистрирован')
    const statusError = trunkStatus?.error

    const onOpenEdit = useCallback(() => {
        if (trunk.id) {
            navigate(getRouteSipTrunkEdit(trunk.id))
        }
    }, [trunk.id, navigate])

    return (
        <Card
            padding={'0'}
            max
            border={'partial'}
            variant={'outlined'}
            className={classNames(cls.SipTrunksItem, {}, [className])}
            onClick={onOpenEdit}
        >
            <VStack className={cls.content} max gap="12">
                <HStack max justify="end" align="center">
                    <HStack gap="8">
                        <div className={classNames(cls.statusBadge, { [cls.registered]: isRegistered })}>
                            <div className={classNames(cls.statusPulse, { [cls.registered]: isRegistered })} />
                            <Text
                                text={statusText}
                                size="s"
                                bold
                            />
                        </div>
                    </HStack>
                </HStack>

                <HStack gap={'16'} max align="center">
                    <div className={cls.avatar}>
                        <PhoneForwarded size={24} />
                    </div>
                    <VStack max gap="4">
                        <Text title={trunk.name} size={'m'} bold className={cls.title} />
                        <HStack gap="8" align="center">
                            <div className={classNames(cls.statusDot, { [cls.inactive]: !trunk.active })} />
                            <Text
                                text={trunk.active ? t('Активен') : t('Неактивен')}
                                size="s"
                                className={classNames(cls.statusText, { [cls.inactive]: !trunk.active })}
                            />
                        </HStack>
                    </VStack>
                </HStack>

                <div className={cls.divider} />

                <VStack gap="16" max className={cls.details}>
                    {isAdmin && trunk.user?.name && (
                        <HStack gap="12" align="start">
                            <div className={cls.detailIcon}>
                                <UserIcon size={14} />
                            </div>
                            <VStack max>
                                <Text text={t('Клиент')} variant="accent" size="s" />
                                <Text text={trunk.user.name} className={cls.urlText} />
                            </VStack>
                        </HStack>
                    )}

                    <HStack gap="12" align="start">
                        <div className={cls.detailIcon}>
                            <Server size={14} />
                        </div>
                        <VStack max>
                            <Text text={t('SIP Сервер')} variant="accent" size="s" />
                            <Text text={trunk.sipServerAddress || t('Не настроен')} className={cls.urlText} />
                        </VStack>
                    </HStack>

                    {trunk.assistant?.name && (
                        <HStack gap="12" align="start">
                            <div className={cls.detailIcon}>
                                <PhoneForwarded size={14} />
                            </div>
                            <VStack max>
                                <Text text={t('Ассистент')} variant="accent" size="s" />
                                <Text text={trunk.assistant.name} className={cls.urlText} />
                            </VStack>
                        </HStack>
                    )}

                    {statusError && (
                        <Text text={statusError} size="s" variant="error" />
                    )}
                </VStack>
            </VStack>
        </Card>
    )
})
