import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Button } from '@/shared/ui/redesigned/Button'
import { classNames } from '@/shared/lib/classNames/classNames'

interface UsageLimitsFormProps {
    className?: string
}

export const UsageLimitsForm = memo((props: UsageLimitsFormProps) => {
    const { className } = props
    const { t } = useTranslation('payment')

    const [limitAmount, setLimitAmount] = useState('')
    const [emails, setEmails] = useState('')

    const handleSave = useCallback(() => {
        // Mock save
        console.log('Sending limit:', limitAmount, emails)
        // Here you would dispatch an action or call a mutation
    }, [limitAmount, emails])

    return (
        <VStack gap="16" max className={classNames('', {}, [className])}>
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

            <Button onClick={handleSave}>
                {t('Сохранить')}
            </Button>
        </VStack>
    )
})
