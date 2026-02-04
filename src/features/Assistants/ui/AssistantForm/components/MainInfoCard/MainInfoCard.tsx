import { memo, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { classNames } from '@/shared/lib/classNames/classNames'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { ClientSelect, getUserAuthData, isUserAdmin } from '@/entities/User'
import { Tool, ToolsSelect } from '@/entities/Tools'
import { VoiceSelect } from '@/entities/Assistants/ui/VoiceSelect/VoiceSelect'
import { ModelSelect } from '@/entities/Assistants/ui/ModelSelect/ModelSelect'
import { Assistant } from '@/entities/Assistants/model/types/assistants'
import { getAssistantFormData } from '@/entities/Assistants/model/selectors/assistantFormSelectors'
import cls from './MainInfoCard.module.scss'

interface MainInfoCardProps {
    className?: string
    onChangeTextHandler?: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onChangeSelectHandler?: (field: keyof Assistant) => (event: any, newValue: string) => void
    onChangeClientHandler?: (clientId: string) => void
    onChangeToolsHandler?: (event: any, value: Tool[]) => void
}

export const MainInfoCard = memo((props: MainInfoCardProps) => {
    const {
        className,
        onChangeTextHandler,
        onChangeSelectHandler,
        onChangeClientHandler,
        onChangeToolsHandler
    } = props

    const { t } = useTranslation('assistants')
    const isAdmin = useSelector(isUserAdmin)
    const clientData = useSelector(getUserAuthData)
    const formFields = useSelector(getAssistantFormData)

    const userId = isAdmin ? formFields?.userId : clientData?.id

    return (
        <div className={classNames(cls.MainInfoCard, {}, [className])}>
            <Text
                title={t('Основная информация')}
                className={cls.cardTitle}
                bold
            />

            <VStack max gap="16">
                {isAdmin && (
                    <ClientSelect
                        clientId={formFields?.userId}
                        onChangeClient={onChangeClientHandler}
                        label={String(t('Клиент'))}
                        data-testid="AssistantForm.ClientSelect"
                    />
                )}

                <Textarea
                    label={t('Наименование ассистента') ?? ''}
                    onChange={onChangeTextHandler?.('name')}
                    data-testid="AssistantForm.name"
                    value={formFields?.name || ''}
                    placeholder={t('Название вашего ассистента') ?? ''}
                    required
                />

                <ModelSelect
                    label={String(t('Модель'))}
                    value={formFields?.model || ''}
                    onChangeValue={onChangeSelectHandler?.('model')}
                />

                <VoiceSelect
                    label={String(t('Голос'))}
                    value={formFields?.voice ?? ''}
                    model={formFields?.model}
                    onChangeValue={onChangeSelectHandler?.('voice')}
                />

                <ToolsSelect
                    label={t('Функции') || ''}
                    value={formFields?.tools || []}
                    userId={userId}
                    onChangeTool={onChangeToolsHandler}
                />

                <Textarea
                    label={t('Комментарий') ?? ''}
                    onChange={onChangeTextHandler?.('comment')}
                    data-testid="AssistantForm.comment"
                    value={formFields?.comment || ''}
                    placeholder={t('Добавьте комментарий (необязательно)') ?? ''}
                    minRows={2}
                    multiline
                />
            </VStack>
        </div>
    )
})
