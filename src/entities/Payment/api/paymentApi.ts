import { rtkApi } from '@/shared/api/rtkApi'

// @ts-ignore
import { PaymentListResponse } from '../model/types/payment'

interface CreateIntentArgs {
    userId: string
    amount: number
    currency?: string
}

interface CreateIntentResponse {
    clientSecret: string
    id: string
}

const paymentApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        createIntent: build.mutation<CreateIntentResponse, CreateIntentArgs>({
            query: (args) => ({
                url: '/payments/create-intent',
                method: 'POST',
                body: args
            })
        }),
        getPayments: build.query<PaymentListResponse, any>({
            query: (params) => ({
                url: '/payments',
                method: 'GET',
                params
            })
        })
    })
})

export const { useCreateIntentMutation, useGetPaymentsQuery } = paymentApi
