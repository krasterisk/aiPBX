import { z } from 'zod'

export const createWidgetSchema = z.object({
    name: z.string()
        .min(3, 'Название должно быть не менее 3 символов')
        .max(50, 'Название слишком длинное'),

    assistantId: z.number()
        .positive('Выберите ассистента'),

    allowedDomains: z.array(z.string())
        .min(1, 'Добавьте хотя бы один домен')
        .refine((domains: string[]) => {
            return domains.every(d =>
                /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(d)
            )
        }, 'Неверный формат домена. Используйте: example.com'),

    maxConcurrentSessions: z.number()
        .min(1)
        .max(100)
        .optional()
        .default(10)
})

export const widgetAppearanceSchema = z.object({
    buttonPosition: z.enum(['bottom-right', 'bottom-left', 'top-right', 'top-left']),
    buttonColor: z.string(),
    theme: z.enum(['light', 'dark', 'auto']),
    primaryColor: z.string(),
    accentColor: z.string(),
    language: z.enum(['en', 'ru', 'es', 'de', 'zh']),
    showBranding: z.boolean()
})

export type CreateWidgetFormData = z.infer<typeof createWidgetSchema>
export type WidgetAppearanceFormData = z.infer<typeof widgetAppearanceSchema>
