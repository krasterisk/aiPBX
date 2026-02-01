import { memo, useCallback } from 'react'
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

    const domainsArray = value
        ? value.split(/[\n,]/).map(d => d.trim()).filter(Boolean)
        : []

    const handleChange = useCallback((_: any, newValue: string[]) => {
        onChange(newValue.join('\n'))
    }, [onChange])

    return (
        <Combobox
            multiple
            freeSolo
            className={className}
            options={[]}
            value={domainsArray}
            onChange={handleChange}
            label={t('Разрешённые домены') || ''}
            placeholder={t('example.com') || ''}
            renderInput={(params) => (
                <Textarea
                    {...params}
                    label={t('Разрешённые домены') || ''}
                    placeholder={t('example.com') || ''}
                    helperText={t('По одному домену. Нажмите Enter для добавления.')}
                />
            )}
        />
    )
})
