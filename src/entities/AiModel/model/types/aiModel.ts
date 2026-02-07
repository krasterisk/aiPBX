export interface AiModel {
    id: number;
    name: string;
    comment: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateAiModelDto {
    name: string;
    comment: string;
}

export interface UpdateAiModelDto extends AiModel { }

export interface DeleteAiModelsDto {
    ids: number[];
}
