import { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { InputPassword } from '@/shared/ui/mui/InputPassword'
import { Plus, Trash2 } from 'lucide-react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './HeadersEditor.module.scss'

type AuthMode = 'none' | 'bearer' | 'custom'

interface HeaderEntry {
    key: string
    value: string
}

interface HeadersEditorProps {
    className?: string
    /** The current headers object from the form */
    value?: Record<string, string>
    /** Callback when the entire headers object changes */
    onChange: (headers: Record<string, string>) => void
}

/**
 * Determines the auth mode from an existing headers object.
 * - If headers contain "Authorization: Bearer ...", mode = 'bearer'
 * - If headers have any keys (excluding auth), mode = 'custom'
 * - Otherwise mode = 'none'
 */
function detectMode(headers?: Record<string, string>): AuthMode {
    if (!headers || Object.keys(headers).length === 0) return 'none'

    const authValue = headers.Authorization || headers.authorization
    if (authValue && authValue.startsWith('Bearer ')) {
        // If the only header is Authorization, it's bearer mode
        const otherKeys = Object.keys(headers).filter(
            (k) => k.toLowerCase() !== 'authorization'
        )
        if (otherKeys.length === 0) return 'bearer'
    }

    return 'custom'
}

/**
 * Extracts the Bearer token from a headers object.
 */
function extractBearerToken(headers?: Record<string, string>): string {
    if (!headers) return ''
    const authValue = headers.Authorization || headers.authorization || ''
    if (authValue.startsWith('Bearer ')) {
        return authValue.slice(7)
    }
    return ''
}

/**
 * Converts a headers object into an array of HeaderEntry for the key-value editor.
 */
function headersToEntries(headers?: Record<string, string>): HeaderEntry[] {
    if (!headers || Object.keys(headers).length === 0) {
        return [{ key: '', value: '' }]
    }
    return Object.entries(headers).map(([key, value]) => ({ key, value }))
}

/**
 * Converts an array of HeaderEntry back to a headers object.
 * Skips entries with empty keys.
 */
function entriesToHeaders(entries: HeaderEntry[]): Record<string, string> {
    const result: Record<string, string> = {}
    for (const entry of entries) {
        const key = entry.key.trim()
        if (key) {
            result[key] = entry.value
        }
    }
    return result
}

export const HeadersEditor = memo((props: HeadersEditorProps) => {
    const { className, value, onChange } = props
    const { t } = useTranslation('tools')

    // Ref to track whether the change originated from inside this component
    const isInternalChange = useRef(false)

    // Determine initial mode from the existing headers value
    const [mode, setMode] = useState<AuthMode>(() => detectMode(value))
    const [bearerToken, setBearerToken] = useState<string>(() => extractBearerToken(value))
    const [entries, setEntries] = useState<HeaderEntry[]>(() => headersToEntries(value))

    // Wrapper to call onChange while marking it as internal
    const emitChange = useCallback((headers: Record<string, string>) => {
        isInternalChange.current = true
        onChange(headers)
    }, [onChange])

    // Sync state when value changes from OUTSIDE (e.g., loading from API)
    // Skip sync if the change was triggered by our own emitChange
    useEffect(() => {
        if (isInternalChange.current) {
            isInternalChange.current = false
            return
        }
        const detectedMode = detectMode(value)
        setMode(detectedMode)
        if (detectedMode === 'bearer') {
            setBearerToken(extractBearerToken(value))
        } else if (detectedMode === 'custom') {
            setEntries(headersToEntries(value))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(value)])

    const authModes = useMemo(() => [
        { id: 'none', name: t('Нет') },
        { id: 'bearer', name: 'Bearer Token' },
        { id: 'custom', name: t('Пользовательские заголовки') }
    ], [t])

    // --- Mode change ---
    const onModeChange = useCallback((_e: any, v: any) => {
        const newMode = (Array.isArray(v) ? 'none' : v?.id) as AuthMode
        setMode(newMode)

        if (newMode === 'none') {
            setBearerToken('')
            setEntries([{ key: '', value: '' }])
            emitChange({})
        } else if (newMode === 'bearer') {
            setEntries([{ key: '', value: '' }])
            if (bearerToken) {
                emitChange({ Authorization: `Bearer ${bearerToken}` })
            } else {
                emitChange({})
            }
        } else if (newMode === 'custom') {
            setBearerToken('')
            const existingEntries = headersToEntries(value)
            setEntries(existingEntries)
            emitChange(entriesToHeaders(existingEntries))
        }
    }, [emitChange, bearerToken, value])

    // --- Bearer token change ---
    const onBearerTokenChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const token = e.target.value
        setBearerToken(token)
        if (token.trim()) {
            emitChange({ Authorization: `Bearer ${token}` })
        } else {
            emitChange({})
        }
    }, [emitChange])

    // --- Custom headers: entry change ---
    const onEntryChange = useCallback((index: number, field: 'key' | 'value', val: string) => {
        const updated = [...entries]
        updated[index] = { ...updated[index], [field]: val }
        setEntries(updated)
        emitChange(entriesToHeaders(updated))
    }, [entries, emitChange])

    // --- Custom headers: add entry ---
    const onAddEntry = useCallback(() => {
        setEntries((prev) => [...prev, { key: '', value: '' }])
    }, [])

    // --- Custom headers: remove entry ---
    const onRemoveEntry = useCallback((index: number) => {
        const updated = entries.filter((_, i) => i !== index)
        const result = updated.length > 0 ? updated : [{ key: '', value: '' }]
        setEntries(result)
        emitChange(entriesToHeaders(result))
    }, [entries, emitChange])

    return (
        <VStack gap="12" max className={classNames(cls.HeadersEditor, {}, [className])}>
            <VStack gap="8" max>
                <Text text={t('Авторизация') || ''} size="s" bold className={cls.label} />
                <Combobox
                    options={authModes}
                    value={authModes.find((m) => m.id === mode) || authModes[0]}
                    onChange={onModeChange}
                    className={cls.fullWidth}
                    disableClearable
                    getOptionLabel={(option: any) => option.name}
                />
            </VStack>

            {/* Bearer Token Input */}
            {mode === 'bearer' && (
                <VStack gap="8" max>
                    <Text text={t('Токен') || ''} size="s" bold className={cls.label} />
                    <InputPassword
                        placeholder={t('Введите Bearer токен') || 'your-token-here'}
                        value={bearerToken}
                        onChange={onBearerTokenChange}
                        size="small"
                        className={cls.fullWidth}
                    />
                </VStack>
            )}

            {/* Custom Headers Key-Value Editor */}
            {mode === 'custom' && (
                <VStack gap="8" max>
                    <Text text={t('Заголовки') || ''} size="s" bold className={cls.label} />
                    <div className={cls.headersList}>
                        {entries.map((entry, index) => (
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
                                        onChange={(e) => onEntryChange(index, 'key', e.target.value)}
                                        className={cls.fullWidth}
                                        size="small"
                                    />
                                    <Textarea
                                        placeholder="Value"
                                        value={entry.value}
                                        onChange={(e) => onEntryChange(index, 'value', e.target.value)}
                                        className={cls.fullWidth}
                                        size="small"
                                    />
                                </HStack>
                                <button
                                    type="button"
                                    className={cls.removeBtn}
                                    onClick={() => onRemoveEntry(index)}
                                    title={t('Удалить') || 'Remove'}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </HStack>
                        ))}
                        <button
                            type="button"
                            className={cls.addBtn}
                            onClick={onAddEntry}
                        >
                            <Plus size={16} />
                            {t('Добавить')}
                        </button>
                    </div>
                </VStack>
            )}
        </VStack>
    )
})
