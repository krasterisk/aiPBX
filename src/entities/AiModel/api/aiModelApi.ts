import { rtkApi } from '@/shared/api/rtkApi';
import { AiModel, CreateAiModelDto, UpdateAiModelDto, DeleteAiModelsDto } from '../model/types/aiModel';

const aiModelApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getAiModels: build.query<AiModel[], void>({
            query: () => '/aiModels',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'AiModels' as const, id })),
                        { type: 'AiModels', id: 'LIST' },
                    ]
                    : [{ type: 'AiModels', id: 'LIST' }],
        }),
        getAiModelById: build.query<AiModel, number>({
            query: (id) => `/aiModels/${id}`,
            providesTags: (result, error, id) => [{ type: 'AiModels', id }],
        }),
        createAiModel: build.mutation<AiModel, CreateAiModelDto>({
            query: (dto) => ({
                url: '/aiModels',
                method: 'POST',
                body: dto,
            }),
            invalidatesTags: [{ type: 'AiModels', id: 'LIST' }],
        }),
        updateAiModel: build.mutation<AiModel, UpdateAiModelDto>({
            query: (dto) => ({
                url: '/aiModels', // Controller uses @Put() at root /aiModels
                method: 'PUT',
                body: dto,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'AiModels', id }],
        }),
        deleteAiModels: build.mutation<void, DeleteAiModelsDto>({
            query: (body) => ({
                url: '/aiModels', // Controller uses @Delete() at root /aiModels
                method: 'DELETE',
                body,
            }),
            invalidatesTags: (result, error, { ids }) => [
                ...ids.map(id => ({ type: 'AiModels' as const, id })),
                { type: 'AiModels', id: 'LIST' }
            ],
        }),
    }),
});

export const useAiModels = aiModelApi.useGetAiModelsQuery;
export const useAiModel = aiModelApi.useGetAiModelByIdQuery;
export const useCreateAiModel = aiModelApi.useCreateAiModelMutation;
export const useUpdateAiModel = aiModelApi.useUpdateAiModelMutation;
export const useDeleteAiModels = aiModelApi.useDeleteAiModelsMutation;
