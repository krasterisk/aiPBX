import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '@/widgets/Page';
import { VStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import { PaymentList } from '@/entities/Payment';

const PaymentDetailsPage = memo(() => {
    const { t } = useTranslation('payment');

    return (
        <Page data-testid="PaymentDetailsPage">
            <VStack gap="16" max>
                <PaymentList />
            </VStack>
        </Page>
    );
});

export default PaymentDetailsPage;
