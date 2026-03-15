import { rtkApi } from '@/shared/api/rtkApi'
import { Price, CreatePriceDto, UpdatePriceDto, PublicPriceResponse } from '../model/types/price'

const priceApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getPrices: build.query<Price[], void>({
            query: () => '/prices',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Prices' as const, id })),
                        { type: 'Prices', id: 'LIST' },
                    ]
                    : [{ type: 'Prices', id: 'LIST' }],
        }),
        getPriceById: build.query<Price, number>({
            query: (id) => `/prices/${id}`,
            providesTags: (result, error, id) => [{ type: 'Prices', id }],
        }),
        getPublicPrices: build.query<PublicPriceResponse, string>({
            query: (currency) => `/prices/public?currency=${currency}`,
            keepUnusedDataFor: 300,
        }),
        createPrice: build.mutation<Price, CreatePriceDto>({
            query: (dto) => ({
                url: '/prices',
                method: 'POST',
                body: dto,
            }),
            invalidatesTags: [{ type: 'Prices', id: 'LIST' }],
        }),
        updatePrice: build.mutation<Price, { id: number, dto: UpdatePriceDto }>({
            query: ({ id, dto }) => ({
                url: `/prices/${id}`,
                method: 'PUT',
                body: dto,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Prices', id }],
        }),
        deletePrice: build.mutation<void, number>({
            query: (id) => ({
                url: `/prices/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Prices', id }, { type: 'Prices', id: 'LIST' }],
        }),
    }),
})

export const usePrices = priceApi.useGetPricesQuery
export const usePrice = priceApi.useGetPriceByIdQuery
export const usePublicPrices = priceApi.useGetPublicPricesQuery
export const useCreatePrice = priceApi.useCreatePriceMutation
export const useUpdatePrice = priceApi.useUpdatePriceMutation
export const useDeletePrice = priceApi.useDeletePriceMutation
