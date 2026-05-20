import { rtkApi } from '@/shared/api/rtkApi'

import type {

    BalanceThresholdAlert,

    CreateBalanceAlertBody,

    UpdateBalanceAlertBody,

} from '../model/types/balanceAlert'

const alertsTag = (ownerUserId: string) => ({ type: 'BalanceAlerts' as const, id: ownerUserId })

/** Tags to invalidate after mutations; matches getBalanceAlerts providesTags. */

function invalidateBalanceAlertsTags(

    ownerUserId?: string | number | null,

): Array<{ type: 'BalanceAlerts', id: string } | { type: 'BalanceAlerts' }> {
    const id = ownerUserId != null && String(ownerUserId) !== '' ? String(ownerUserId) : ''

    if (id) {
        return [alertsTag(id)]
    }

    return [{ type: 'BalanceAlerts' }]
}

export const balanceAlertApi = rtkApi.injectEndpoints({

    endpoints: (build) => ({

        getBalanceAlerts: build.query<BalanceThresholdAlert[], string>({

            query: (ownerUserId) => ({

                url: '/users/balance-alerts',

                params: ownerUserId ? { ownerUserId } : undefined,

            }),

            providesTags: (_r, _e, ownerUserId) => invalidateBalanceAlertsTags(ownerUserId),

        }),

        createBalanceAlert: build.mutation<BalanceThresholdAlert, CreateBalanceAlertBody>({

            query: (body) => ({

                url: '/users/balance-alerts',

                method: 'POST',

                body,

            }),

            invalidatesTags: (result, _e, arg) => invalidateBalanceAlertsTags(

                result?.ownerUserId ?? arg.ownerUserId,

            ),

        }),

        updateBalanceAlert: build.mutation<

            BalanceThresholdAlert,

            { id: number, ownerUserId: string, body: UpdateBalanceAlertBody }

        >({

            query: ({ id, ownerUserId, body }) => ({

                url: `/users/balance-alerts/${id}`,

                method: 'PATCH',

                params: ownerUserId ? { ownerUserId } : undefined,

                body,

            }),

            invalidatesTags: (result, _e, arg) => invalidateBalanceAlertsTags(

                result?.ownerUserId ?? arg.ownerUserId,

            ),

        }),

        deleteBalanceAlert: build.mutation<{ success: boolean }, { id: number, ownerUserId: string }>({

            query: ({ id, ownerUserId }) => ({

                url: `/users/balance-alerts/${id}`,

                method: 'DELETE',

                params: ownerUserId ? { ownerUserId } : undefined,

            }),

            invalidatesTags: (_r, _e, arg) => invalidateBalanceAlertsTags(arg.ownerUserId),

        }),

    }),

})

export const {

    useGetBalanceAlertsQuery,

    useCreateBalanceAlertMutation,

    useUpdateBalanceAlertMutation,

    useDeleteBalanceAlertMutation,

} = balanceAlertApi
