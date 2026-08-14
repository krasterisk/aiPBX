export interface SelectableAssistantModel {
    name: string
    publish?: boolean | number | string | null
}

export function isAssistantModelPublished (model: SelectableAssistantModel): boolean {
    return model.publish === true || model.publish === 1 || model.publish === '1'
}

export function filterSelectableAssistantModels<T extends SelectableAssistantModel> (
    models: T[] | null | undefined,
    isAdmin: boolean,
    currentValue?: string | null,
): T[] {
    if (!models?.length) {
        return []
    }
    if (isAdmin) {
        return models
    }
    return models.filter((model) => (
        isAssistantModelPublished(model)
        || Boolean(currentValue && model.name === currentValue)
    ))
}
