import { rtkApi } from '@/shared/api/rtkApi';

export interface PlaygroundSdpResponse {
    sdp: string;
}

export interface PlaygroundSdpRequest {
    assistantId: string;
    sdp: string;
}

export const playgroundApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        sendSdpOffer: build.mutation<PlaygroundSdpResponse, PlaygroundSdpRequest>({
            query: ({ assistantId, sdp }) => ({
                url: `/assistants/playground/sdp`,
                method: 'POST',
                body: { assistantId, sdp },
            }),
        }),
    }),
});

export const { useSendSdpOfferMutation } = playgroundApi;
