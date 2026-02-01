export type {
    WidgetKey,
    CreateWidgetDto,
    UpdateWidgetDto,
    WidgetAppearanceSettings
} from './model/types/widgetKey'

export { DEFAULT_APPEARANCE_SETTINGS } from './model/types/widgetKey'

export {
    widgetKeysApi,
    useWidgetKeys,
    useWidgetKey,
    useCreateWidgetKey,
    useUpdateWidgetKey,
    useDeleteWidgetKey,
    useUploadWidgetLogo
} from './api/widgetKeysApi'
