import { useTranslation } from 'react-i18next'
import { memo, useCallback, ReactNode } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { TextField } from '@mui/material'
import { Building2 } from 'lucide-react'
import { useGetOurOrganizationsQuery } from '../../api/ourOrganizationApi'

interface OurOrganizationSelectProps {
    label?: string
    organizationId?: string
    className?: string
    fullWidth?: boolean
    onChangeOrganization?: (organizationId: string) => void
    size?: 'small' | 'medium'
    error?: string
    placeholder?: string
    addonLeft?: ReactNode
    showIcon?: boolean
    disabled?: boolean
}

interface OurOrganizationOption {
    id: string
    name: string
    isPrimary: boolean
}

export const OurOrganizationSelect = memo((props: OurOrganizationSelectProps) => {
    const { t } = useTranslation('users')
    const {
        className,
        label,
        organizationId,
        onChangeOrganization,
        fullWidth = true,
        size = 'medium',
        error,
        placeholder,
        addonLeft,
        showIcon = true,
        disabled: disabledProp,
    } = props

    const { data, isLoading } = useGetOurOrganizationsQuery()

    const items: OurOrganizationOption[] = (data || []).map((item) => ({
        id: String(item.id),
        name: item.isPrimary ? `${item.name} (${t('ourOrg.primaryBadge')})` : item.name,
        isPrimary: item.isPrimary,
    }))

    const selected = organizationId
        ? items.find((item) => item.id === organizationId) || null
        : null

    const handleChange = useCallback((_event: unknown, value: OurOrganizationOption | null) => {
        if (!value) {
            onChangeOrganization?.('')
        } else {
            onChangeOrganization?.(value.id)
        }
    }, [onChangeOrganization])

    const leftAddon = addonLeft || (showIcon ? <Building2 size={18} style={{ marginRight: 8 }} /> : undefined)
    const placeholderText = placeholder || String(t('ourOrg.selectPlaceholder'))

    return (
        <Combobox
            className={className}
            label={label}
            size={size}
            options={items}
            value={selected}
            onChange={handleChange}
            fullWidth={fullWidth}
            disabled={disabledProp || isLoading}
            noOptionsText={t('ourOrg.notFound') ?? ''}
            getOptionLabel={(option: OurOrganizationOption) => option.name}
            isOptionEqualToValue={(option: OurOrganizationOption, value: OurOrganizationOption) =>
                option.id === value.id}
            renderInput={(params: Record<string, unknown>) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder={isLoading ? String(t('Загрузка...')) : placeholderText}
                    error={!!error}
                    helperText={error}
                    size={size}
                    InputProps={{
                        ...(params.InputProps as object),
                        startAdornment: (
                            <>
                                {leftAddon}
                                {(params.InputProps as { startAdornment?: ReactNode })?.startAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    )
})
