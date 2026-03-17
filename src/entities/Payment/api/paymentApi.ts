import { rtkApi } from '@/shared/api/rtkApi'

// @ts-ignore
import { Payment, PaymentListResponse } from '../model/types/payment'

interface CreateIntentArgs {
    userId: string
    amount: number
    currency?: string
}

interface CreateIntentResponse {
    clientSecret: string
    id: string
}

interface CreateRobokassaArgs {
    amount: number
    description?: string
}

interface CreateRobokassaResponse {
    paymentUrl: string
    invId: number
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
        }),
        createRobokassaPayment: build.mutation<CreateRobokassaResponse, CreateRobokassaArgs>({
            query: (args) => ({
                url: '/payments/robokassa/create',
                method: 'POST',
                body: args
            })
        }),
        getRobokassaStatus: build.query<Payment, string>({
            query: (invId) => `/payments/robokassa/status/${invId}`
        })
    })
})

export const {
    useCreateIntentMutation,
    useGetPaymentsQuery,
    useCreateRobokassaPaymentMutation,
    useLazyGetRobokassaStatusQuery
} = paymentApi

