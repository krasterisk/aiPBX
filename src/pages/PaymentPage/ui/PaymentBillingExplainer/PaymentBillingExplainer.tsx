import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Card } from '@/shared/ui/redesigned/Card'
import { getTenantCurrencyCode } from '@/shared/lib/domain'
import cls from './PaymentBillingExplainer.module.scss'

export const PaymentBillingExplainer = memo(() => {
    const { t } = useTranslation('payment')
    const isRubTenant = getTenantCurrencyCode() === 'RUB'

    if (!isRubTenant) {
        return null
    }

    return (
        <Card variant="glass" border="partial" padding="16" max className={cls.PaymentBillingExplainer}>
            <VStack gap="8" max>
                <Text title={t('billing.explainer.title')} bold size="s" />
                <Text text={t('billing.explainer.model')} size="s" />
                <Text text={t('billing.explainer.prepaid')} size="s" />
                <Text text={t('billing.explainer.payg')} size="s" />
                <Text text={t('billing.explainer.displayRub')} size="s" />
                <Text text={t('billing.explainer.topupRub')} size="s" />
            </VStack>
        </Card>
    )
})
