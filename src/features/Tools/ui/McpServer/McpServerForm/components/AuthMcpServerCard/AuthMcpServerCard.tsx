import { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { InputPassword } from '@/shared/ui/mui/InputPassword'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Button } from '@/shared/ui/redesigned/Button'
import { Plus, Trash2 } from 'lucide-react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AuthMcpServerCard.module.scss'

interface HeaderEntry {
    key: string
    value: string
}

type AuthType = 'none' | 'bearer' | 'apikey' | 'custom_headers'

interface AuthMcpServerCardProps {
    className?: string
    authType: AuthType
    bearerToken: string
    apiKey: string
    customHeaders: HeaderEntry[]
    onChangeAuthType: (value: AuthType) => void
    onChangeBearerToken: (value: string) => void
    onChangeApiKey: (value: string) => void
    onAddHeader: () => void
    onRemoveHeader: (index: number) => void
    onHeaderChange: (index: number, field: 'key' | 'value', value: string) => void
}

export const AuthMcpServerCard = memo((props: AuthMcpServerCardProps) => {
    const {
        className,
        authType,
        bearerToken,
        apiKey,
        customHeaders,
        onChangeAuthType,
        onChangeBearerToken,
        onChangeApiKey,
        onAddHeader,
        onRemoveHeader,
        onHeaderChange,
    } = props
    const { t } = useTranslation('tools')

    const authTypeOptions = useMemo(() => [
        { id: 'none', name: t('Нет') },
        { id: 'bearer', name: 'Bearer Token' },
        { id: 'apikey', name: 'API Key' },
        { id: 'custom_headers', name: t('Пользовательские заголовки') },
    ], [t])

    return (
        <Card
            max
            padding="24"
            border="partial"
            className={classNames(cls.AuthMcpServerCard, {}, [className])}
        >
            <VStack gap="24" max align="start">
                {/* Auth Type */}
                <VStack gap="8" max>
                    <Text text={t('Тип авторизации') || ''} size="s" bold className={cls.label} />
                    <Combobox
                        options={authTypeOptions}
                        value={authTypeOptions.find(o => o.id === authType) || authTypeOptions[0]}
                        onChange={(_, v: any) => {
                            if (v && !Array.isArray(v)) onChangeAuthType(v.id as AuthType)
                        }}
                        className={cls.fullWidth}
                        disableClearable
                        getOptionLabel={(option: any) => option.name}
                    />
                </VStack>

                {/* Credentials — Bearer */}
                {authType === 'bearer' && (
                    <VStack gap="8" max className={cls.credentialsContainer}>
                        <Text text={t('Токен') || ''} size="s" bold className={cls.label} />
                        <InputPassword
                            placeholder={t('Введите Bearer токен') || ''}
                            value={bearerToken}
                            onChange={(e) => onChangeBearerToken(e.target.value)}
                            size="small"
                            className={cls.fullWidth}
                        />
                    </VStack>
                )}

                {/* Credentials — API Key */}
                {authType === 'apikey' && (
                    <VStack gap="8" max className={cls.credentialsContainer}>
                        <Text text={t('API ключ') || ''} size="s" bold className={cls.label} />
                        <InputPassword
                            placeholder={t('Введите API ключ') || ''}
                            value={apiKey}
                            onChange={(e) => onChangeApiKey(e.target.value)}
                            size="small"
                            className={cls.fullWidth}
                        />
                    </VStack>
                )}

                {/* Credentials — Custom Headers */}
                {authType === 'custom_headers' && (
                    <VStack gap="8" max className={cls.credentialsContainer}>
                        <Text text={t('Заголовки') || ''} size="s" bold className={cls.label} />
                        {customHeaders.map((entry, index) => (
                            <HStack
                                key={index}
                                gap="8"
                                max
                                align="center"
                                className={cls.headerRow}
                            >
                                <HStack gap="8" max className={cls.headerRowInputs}>
                                    <Textarea
                                        placeholder="Header"
                                        value={entry.key}
                                        onChange={(e) => onHeaderChange(index, 'key', e.target.value)}
                                        className={cls.fullWidth}
                                        size="small"
                                    />
                                    <Textarea
                                        placeholder="Value"
                                        value={entry.value}
                                        onChange={(e) => onHeaderChange(index, 'value', e.target.value)}
                                        className={cls.fullWidth}
                                        size="small"
                                    />
                                </HStack>
                                <Button
                                    variant="glass-action"
                                    square
                                    size="s"
                                    className={cls.removeBtn}
                                    onClick={() => onRemoveHeader(index)}
                                    title={t('Удалить') || 'Remove'}
                                    addonLeft={<Trash2 size={16} />}
                                />
                            </HStack>
                        ))}
                        <Button
                            variant="glass-action"
                            size="s"
                            className={cls.addBtn}
                            onClick={onAddHeader}
                            addonLeft={<Plus size={16} />}
                        >
                            {t('Добавить')}
                        </Button>
                    </VStack>
                )}
            </VStack>
        </Card>
    )
})
