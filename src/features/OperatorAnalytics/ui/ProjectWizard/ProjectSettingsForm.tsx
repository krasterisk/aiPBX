import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import SaveIcon from '@mui/icons-material/Save'
import {
    OperatorProject,
    useUpdateOperatorProject,
    projectWizardActions,
    getWizardName,
    getWizardDescription,
    getWizardSystemPrompt,
    getWizardCustomMetrics,
    getWizardVisibleDefaultMetrics,
    getWizardWebhookUrl,
    getWizardWebhookHeaders,
    getWizardWebhookEvents,
} from '@/entities/Report'
import { WizardReviewSection } from './WizardReviewSection'
import { WizardHeader } from './WizardHeader'
import cls from './ProjectWizard.module.scss'

interface ProjectSettingsFormProps {
    editProject: OperatorProject
    onClose: () => void
    onSuccess?: () => void
}

export const ProjectSettingsForm = memo(({ editProject, onClose, onSuccess }: ProjectSettingsFormProps) => {
    const { t } = useTranslation('reports')
    const dispatch = useAppDispatch()
    const [updateProject, { isLoading: isSaving }] = useUpdateOperatorProject()

    const name = useSelector(getWizardName)
    const description = useSelector(getWizardDescription)
    const systemPrompt = useSelector(getWizardSystemPrompt)
    const customMetrics = useSelector(getWizardCustomMetrics)
    const visibleDefaults = useSelector(getWizardVisibleDefaultMetrics)
    const webhookUrl = useSelector(getWizardWebhookUrl)
    const webhookHeaders = useSelector(getWizardWebhookHeaders)
    const webhookEvents = useSelector(getWizardWebhookEvents)

    const handleSave = useCallback(async () => {
        try {
            await updateProject({
                id: editProject.id,
                name: name.trim() || t('Новый проект'),
                description: description.trim(),
                systemPrompt: systemPrompt.trim(),
                customMetricsSchema: customMetrics,
                visibleDefaultMetrics: visibleDefaults,
                webhookUrl: webhookUrl.trim() || undefined,
                webhookHeaders: Object.keys(webhookHeaders).length > 0 ? webhookHeaders : undefined,
                webhookEvents: webhookEvents.length > 0 ? webhookEvents : undefined,
            }).unwrap()

            dispatch(projectWizardActions.close())
            onSuccess?.()
            onClose()
        } catch (err) {
            console.error('Settings save error:', err)
        }
    }, [name, description, systemPrompt, customMetrics, visibleDefaults, webhookUrl, webhookHeaders, webhookEvents, editProject, updateProject, dispatch, onClose, onSuccess, t])

    return (
        <VStack gap={'16'} max className={cls.ProjectWizard}>
            <WizardHeader
                title={name.trim() || String(t('Настройки проекта'))}
                onClose={onClose}
            />

            <HStack gap={'12'} max wrap={'wrap'}>
                <Textarea
                    label={String(t('Название проекта'))}
                    value={name}
                    onChange={e => dispatch(projectWizardActions.setName(e.target.value))}
                    size={'small'}
                    fullWidth
                    multiline={false}
                />
                <Textarea
                    label={String(t('Описание проекта'))}
                    value={description}
                    onChange={e => dispatch(projectWizardActions.setDescription(e.target.value))}
                    size={'small'}
                    fullWidth
                    multiline={false}
                />
            </HStack>

            <Textarea
                label={String(t('Системный промпт'))}
                value={systemPrompt}
                onChange={e => dispatch(projectWizardActions.setSystemPrompt(e.target.value))}
                size={'small'}
                fullWidth
                multiline
                rows={4}
            />

            <WizardReviewSection />

            <HStack max justify={'end'} align={'center'} gap={'12'} wrap={'wrap'} className={cls.navSeparator}>
                <Button variant={'glass-action'} color={'success'} onClick={handleSave}
                    addonRight={<SaveIcon fontSize={'small'} />}
                    disabled={isSaving || !name.trim()}>
                    {isSaving ? String(t('Сохранение...')) : String(t('Сохранить'))}
                </Button>
            </HStack>
        </VStack>
    )
})
