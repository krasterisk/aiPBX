import { lazy } from 'react';

export const PaymentDetailsPageAsync = lazy(
    () => import('./PaymentDetailsPage'),
);
