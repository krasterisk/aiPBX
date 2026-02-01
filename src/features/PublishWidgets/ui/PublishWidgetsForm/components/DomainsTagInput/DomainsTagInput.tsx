import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Textarea } from '@/shared/ui/mui/Textarea'

interface DomainsTagInputProps {
    className?: string
    value: string
    onChange: (value: string) => void
}

export const DomainsTagInput = memo(({ className, value, onChange }: DomainsTagInputProps) => {
    const { t } = useTranslation('publish-widgets')

    const [inputValue, setInputValue] = React.useState('')

    const domainsArray = React.useMemo(() => value
        ? value.split(/[\n,]/).map(d => d.trim()).filter(Boolean)
        : [], [value])

    const updateDomains = useCallback((newDomains: string[]) => {
        // Handle cases where multiple domains might be in one string (e.g. pasting)
        const flattened = newDomains
            .flatMap(d => d.split(/[\n, ]/))
            .map(d => d.trim().toLowerCase())
            .filter(Boolean)

        const unique = Array.from(new Set(flattened))
        onChange(unique.join('\n'))
    }, [onChange])

    const handleChange = useCallback((_: any, newValue: string[]) => {
        updateDomains(newValue)
    }, [updateDomains])

    const handleBlur = useCallback(() => {
        if (inputValue.trim()) {
            const newDomain = inputValue.trim().toLowerCase()
            if (!domainsArray.includes(newDomain)) {
                updateDomains([...domainsArray, newDomain])
            }
            setInputValue('')
        }
    }, [inputValue, domainsArray, updateDomains])

    return (
        <Combobox
            multiple
            freeSolo
            className={className}
            options={[]}
            value={domainsArray}
            onChange={handleChange}
            inputValue={inputValue}
            onInputChange={(_, val) => setInputValue(val)}
            label={t('Разрешённые домены') || ''}
            placeholder={t('example.com') || ''}
            renderInput={(params) => (
                <Textarea
                    {...params}
                    onBlur={(e) => {
                        params.onBlur?.(e)
                        handleBlur()
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ',' || e.key === ' ') {
                            if (inputValue.trim()) {
                                e.preventDefault()
                                handleBlur()
                            }
                        }
                        params.onKeyDown?.(e)
                    }}
                    label={t('Разрешённые домены') || ''}
                    placeholder={t('example.com') || ''}
                    helperText={t('По одному домену. Нажмите Enter, пробел или запятую.')}
                />
            )}
        />
    )
})
