import { memo, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Settings } from 'lucide-react'
import { Input } from '@/shared/ui/mui/Input'
import { Text } from '@/shared/ui/redesigned/Text'
import { SectionCard } from '../SectionCard/SectionCard'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { SipTrunkType, SipTransport } from '../../../../model/types/sipTrunkFormSchema'
import { MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material'

interface PropertiesSipTrunkCardProps {
    className?: string
    name: string
    onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void
    trunkType: SipTrunkType
    onChangeTrunkType: (type: SipTrunkType) => void
    sipServerAddress: string
    onChangeSipServerAddress: (e: React.ChangeEvent<HTMLInputElement>) => void
    transport: SipTransport
    onChangeTransport: (e: React.ChangeEvent<HTMLInputElement>) => void
    // Registration fields
    authName: string
    onChangeAuthName: (e: React.ChangeEvent<HTMLInputElement>) => void
    password: string
    onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void
    domain: string
    onChangeDomain: (e: React.ChangeEvent<HTMLInputElement>) => void
    // IP-based fields
    callerId: string
    onChangeCallerId: (e: React.ChangeEvent<HTMLInputElement>) => void
    providerIp: string
    onChangeProviderIp: (e: React.ChangeEvent<HTMLInputElement>) => void
    statusBadge?: ReactNode
}

const toggleStyles = {
    '& .MuiToggleButton-root': {
        color: 'var(--text-redesigned)',
        borderColor: 'var(--icon-redesigned)',
        fontSize: '0.8rem',
        padding: '6px 16px',
        textTransform: 'none' as const,
        '&.Mui-selected': {
            color: '#fff',
            backgroundColor: 'var(--accent-redesigned)',
            borderColor: 'var(--accent-redesigned)',
            '&:hover': {
                backgroundColor: 'var(--accent-redesigned)'
            }
        },
        '&:hover': {
            backgroundColor: 'rgba(var(--accent-redesigned-rgb, 99, 102, 241), 0.08)'
        }
    }
}

export const PropertiesSipTrunkCard = memo((props: PropertiesSipTrunkCardProps) => {
    const {
        name,
        onChangeName,
        trunkType,
        onChangeTrunkType,
        sipServerAddress,
        onChangeSipServerAddress,
        transport,
        onChangeTransport,
        authName,
        onChangeAuthName,
        password,
        onChangePassword,
        domain,
        onChangeDomain,
        callerId,
        onChangeCallerId,
        providerIp,
        onChangeProviderIp,
        statusBadge
    } = props
    const { t } = useTranslation('sip-trunks')

    const handleTrunkType = (_: React.MouseEvent<HTMLElement>, value: SipTrunkType | null) => {
        if (value) onChangeTrunkType(value)
    }

    return (
        <SectionCard title={t('Параметры')} icon={Settings} rightElement={statusBadge}>
            <Input
                label={t('Наименование') || ''}
                value={name}
                onChange={onChangeName}
                placeholder={t('Введите наименование транка') || ''}
                fullWidth
            />

            <VStack gap="8" max>
                <Text text={t('Тип подключения')} size="s" bold />
                <ToggleButtonGroup
                    value={trunkType}
                    exclusive
                    onChange={handleTrunkType}
                    size="small"
                    sx={toggleStyles}
                >
                    <ToggleButton value="registration">
                        {t('Регистрация')}
                    </ToggleButton>
                    <ToggleButton value="ip">
                        {t('По IP-адресу')}
                    </ToggleButton>
                </ToggleButtonGroup>
            </VStack>

            <HStack gap="16" max wrap="wrap">
                <div style={{ flex: 2, minWidth: 200 }}>
                    <Input
                        label={t('Адрес SIP-сервера:порт') || ''}
                        value={sipServerAddress}
                        onChange={onChangeSipServerAddress}
                        placeholder="sip.example.com:5060"
                        fullWidth
                    />
                </div>
                <div style={{ flex: 1, minWidth: 120 }}>
                    <Input
                        label={t('Транспорт') || ''}
                        value={transport}
                        onChange={onChangeTransport}
                        select
                        fullWidth
                    >
                        <MenuItem value="udp">UDP</MenuItem>
                        <MenuItem value="tcp">TCP</MenuItem>
                        <MenuItem value="tls">TLS</MenuItem>
                    </Input>
                </div>
            </HStack>

            <Text
                text={t('Укажите адрес внешнего SIP-сервера. Порт по умолчанию: 5060')}
                size="s"
                variant="accent"
            />

            {trunkType === 'registration' && (
                <>
                    <Input
                        label={t('Имя авторизации') || ''}
                        value={authName}
                        onChange={onChangeAuthName}
                        placeholder={t('Введите имя авторизации') || ''}
                        fullWidth
                    />

                    <Input
                        label={t('Пароль') || ''}
                        value={password}
                        onChange={onChangePassword}
                        placeholder={t('Введите пароль') || ''}
                        type="password"
                        fullWidth
                    />

                    <Input
                        label={t('Домен') || ''}
                        value={domain}
                        onChange={onChangeDomain}
                        placeholder={t('Домен провайдера (по умолчанию = хост)') || ''}
                        fullWidth
                    />

                    <Text
                        text={t('Оставьте домен пустым, если он совпадает с адресом SIP-сервера')}
                        size="s"
                        variant="accent"
                    />
                </>
            )}

            {trunkType === 'ip' && (
                <>
                    <Input
                        label={t('А-номер (CallerID)') || ''}
                        value={callerId}
                        onChange={onChangeCallerId}
                        placeholder={t('Например: 74951234567') || ''}
                        fullWidth
                    />

                    <Text
                        text={t('Номер, который будет передаваться в заголовке From при исходящих вызовах')}
                        size="s"
                        variant="accent"
                    />

                    <Input
                        label={t('IP-адрес провайдера') || ''}
                        value={providerIp}
                        onChange={onChangeProviderIp}
                        placeholder={t('Например: 203.0.113.10') || ''}
                        fullWidth
                    />

                    <Text
                        text={t('Используется для идентификации входящих вызовов от провайдера')}
                        size="s"
                        variant="accent"
                    />
                </>
            )}
        </SectionCard>
    )
})
