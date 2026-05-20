import { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Loader } from '@/shared/ui/Loader'
import { useGetTenantMembers } from '../../api/usersApi'

export interface NotifyEmailOption {
    email: string
    userId?: string
    label: string
}

export { parseNotifyEmails } from '../../lib/parseNotifyEmails'

function toOption(email: string, members: NotifyEmailOption[]): NotifyEmailOption {
    const normalized = email.trim().toLowerCase()
    const fromMember = members.find((m) => m.email === normalized)
    if (fromMember) return fromMember
    return { email: normalized, label: normalized }
}

interface TenantNotifyEmailsSelectProps {
    ownerUserId: string
    emails: string[]
    onChange: (emails: string[], notifyUserIds: number[]) => void
    disabled?: boolean
}

export const TenantNotifyEmailsSelect = memo((props: TenantNotifyEmailsSelectProps) => {
    const { ownerUserId, emails, onChange, disabled } = props
    const { t } = useTranslation('payment')

    const { data: members, isLoading } = useGetTenantMembers(ownerUserId, {
        skip: !ownerUserId,
    })

    const memberOptions: NotifyEmailOption[] = useMemo(() => (
        (members || [])
            .filter((u) => u.email?.trim())
            .map((u) => ({
                email: u.email!.trim().toLowerCase(),
                userId: String(u.id),
                label: `${u.name || u.id} (${u.email})`,
            }))
    ), [members])

    const value = useMemo(
        () => emails.map((e) => toOption(e, memberOptions)),
        [emails, memberOptions],
    )

    const handleChange = useCallback((
        _: unknown,
        newValue: Array<NotifyEmailOption | string>,
    ) => {
        const nextEmails: string[] = []
        const nextUserIds = new Set<number>()

        for (const item of newValue) {
            if (typeof item === 'string') {
                const e = item.trim().toLowerCase()
                if (e) nextEmails.push(e)
                continue
            }
            const e = item.email.trim().toLowerCase()
            if (!e) continue
            nextEmails.push(e)
            if (item.userId) {
                nextUserIds.add(Number(item.userId))
            }
        }

        onChange(
            Array.from(new Set(nextEmails)),
            Array.from(nextUserIds).filter((id) => Number.isFinite(id)),
        )
    }, [onChange])

    if (isLoading) {
        return <Loader />
    }

    return (
        <Combobox
            multiple
            freeSolo
            filterSelectedOptions
            disabled={disabled}
            label={String(t('limits.tenantUsers.label'))}
            options={memberOptions}
            value={value}
            getOptionLabel={(option: NotifyEmailOption | string) => (
                typeof option === 'string' ? option : option.label
            )}
            isOptionEqualToValue={(a, b) => {
                const emailA = typeof a === 'string' ? a.trim().toLowerCase() : a.email
                const emailB = typeof b === 'string' ? b.trim().toLowerCase() : b.email
                return emailA === emailB
            }}
            onChange={handleChange}
            noOptionsText={String(t('limits.tenantUsers.empty'))}
        />
    )
})
