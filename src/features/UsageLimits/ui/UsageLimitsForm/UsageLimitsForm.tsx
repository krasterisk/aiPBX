import { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getUserAuthData, useGetUsageLimit, useSetUsageLimit } from '@/entities/User'
import { toast } from 'react-toastify'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Button } from '@/shared/ui/redesigned/Button'

interface UsageLimitsFormProps {
    className?: string
}

export const UsageLimitsForm = memo((props: UsageLimitsFormProps) => {
    const { className } = props
    const { t } = useTranslation('payment')

    const authData = useSelector(getUserAuthData)
    const [setUsageLimit, { isLoading }] = useSetUsageLimit()
    const { data: usageLimitData, isLoading: isFetching } = useGetUsageLimit(authData?.id || '', { skip: !authData?.id })

    const [limitAmount, setLimitAmount] = useState('')
    const [emails, setEmails] = useState('')

    useEffect(() => {
        if (usageLimitData) {
            setLimitAmount(String(usageLimitData.limitAmount || ''))
            setEmails(usageLimitData.emails?.join('\n') || '')
        }
    }, [usageLimitData])

    const handleSave = useCallback(async () => {
        if (!authData?.id) return

        const emailList = emails.split(/[\n,]+/).map(e => e.trim()).filter(Boolean)
        const amount = Number(limitAmount)

        if (isNaN(amount)) {
            toast.error(t('Некорректная сумма'))
            return
        }

        try {
            await setUsageLimit({
                userId: String(authData.id),
                limitAmount: amount,
                emails: emailList
            }).unwrap()
            toast.success(t('Настройки сохранены'))
        } catch (e) {
            // Error toast handled by global toastMiddleware
        }
    }, [authData?.id, emails, limitAmount, setUsageLimit, t])

    return (
        <VStack gap="16" max className={className}>
            <Text title={t('Порог для уведомления')} text={t('Укажите сумму, при достижении которой вы будете получать уведомления')} />

            <Textarea
                label={t('Сумма лимита ($)') || ''}
                value={limitAmount}
                onChange={(e) => setLimitAmount(e.target.value)}
                placeholder="100"
            />

            <Textarea
                label={t('Email адреса для уведомлений (через запятую или с новой строки)') || ''}
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="email@example.com"
                multiline
                minRows={3}
            />
            <Button
                onClick={handleSave}
                disabled={isLoading}
                variant="glass-action"
            >
                {t('Сохранить')}
            </Button>
        </VStack>
    )
})
