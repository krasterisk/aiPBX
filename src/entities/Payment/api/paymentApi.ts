import { rtkApi } from '@/shared/api/rtkApi'

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
        })
    })
})

export const { useCreateIntentMutation } = paymentApi
