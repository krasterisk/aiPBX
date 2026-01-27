import { classNames } from '@/shared/lib/classNames/classNames'
import { useTranslation } from 'react-i18next'
import cls from './PlaygroundAssistantSettings.module.scss'
import { memo, useCallback, useEffect, useRef } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { ModelSelect, VoiceSelect } from '@/entities/Assistants'
import { Tool, ToolsSelect } from '@/entities/Tools'
import { Slider } from '@/shared/ui/mui/Slider/Slider'
import { Tooltip, IconButton } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useSelector, useDispatch } from 'react-redux'
import { getPlaygroundFormData, getPlaygroundFormLoading, playgroundAssistantFormActions } from '@/pages/Playground'
import { useUpdateAssistant } from '@/entities/Assistants/api/assistantsApi'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { Assistant } from '@/entities/Assistants'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { toast } from 'react-toastify'

interface PlaygroundAssistantSettingsProps {
    className?: string
}

export const PlaygroundAssistantSettings = memo((props: PlaygroundAssistantSettingsProps) => {
    const { className } = props
    const { t } = useTranslation('playground')
    const dispatch = useDispatch()

    const formData = useSelector(getPlaygroundFormData)
    const isLoading = useSelector(getPlaygroundFormLoading)
    const userData = useSelector(getUserAuthData)
    const isAdmin = useSelector(isUserAdmin)

    const [updateAssistant, { isLoading: isUpdating }] = useUpdateAssistant()

    const userId = isAdmin ? formData?.userId : userData?.id
    const prevModelRef = useRef<string | undefined>(formData?.model)

    // Clear voice when model changes
    useEffect(() => {
        if (formData?.model && prevModelRef.current && formData.model !== prevModelRef.current) {
            dispatch(playgroundAssistantFormActions.updateFormField({ voice: '' }))
        }
        prevModelRef.current = formData?.model
    }, [formData?.model, dispatch])

    const onChangeSelectHandler = useCallback((field: keyof Assistant) => (event: any, newValue: string) => {
        dispatch(playgroundAssistantFormActions.updateFormField({ [field]: newValue }))
    }, [dispatch])

    const onChangeToolsHandler = useCallback((event: any, value: Tool[]) => {
        dispatch(playgroundAssistantFormActions.updateFormField({ tools: value }))
    }, [dispatch])

    const onChangeSliderHandler = useCallback((field: keyof Assistant) => (value: number) => {
        dispatch(playgroundAssistantFormActions.updateFormField({ [field]: String(value) }))
    }, [dispatch])

    const onChangeTextHandler = useCallback((field: keyof Assistant) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(playgroundAssistantFormActions.updateFormField({ [field]: event.target.value }))
    }, [dispatch])

    const handleApply = useCallback(async () => {
        if (!formData || !formData.id) return

        try {
            dispatch(playgroundAssistantFormActions.setLoading(true))
            await updateAssistant({
                id: formData.id,
                model: formData.model,
                voice: formData.voice,
                tools: formData.tools,
                instruction: formData.instruction,
                turn_detection_threshold: formData.turn_detection_threshold,
                turn_detection_prefix_padding_ms: formData.turn_detection_prefix_padding_ms,
                turn_detection_silence_duration_ms: formData.turn_detection_silence_duration_ms,
                idle_timeout_ms: formData.idle_timeout_ms
            }).unwrap()
            dispatch(playgroundAssistantFormActions.setError(undefined))
            toast.success(t('Сохранено успешно'))
        } catch (error) {
            dispatch(playgroundAssistantFormActions.setError(String(error)))
            toast.error(t('Ошибка при сохранении'))
        } finally {
            dispatch(playgroundAssistantFormActions.setLoading(false))
        }
    }, [formData, updateAssistant, dispatch, t])

    if (!formData) {
        return null
    }

    return (
        <VStack gap={'16'} max className={classNames(cls.PlaygroundAssistantSettings, {}, [className])}>
            {/* Apply Button */}
            <HStack justify={'start'} max>
                <Button
                    variant={'filled'}
                    color={'success'}
                    onClick={handleApply}
                    disabled={isLoading || isUpdating}
                >
                    {isUpdating ? t('Применение...') : t('Применить')}
                </Button>
            </HStack>

            {/* Cards Container */}
            <HStack gap={'16'} max wrap={'wrap'} align={'start'}>
                {/* Instructions Card */}
                <Card padding={'16'} className={cls.card}>
                    <VStack gap={'16'} max>
                        <Text text={t('Инструкции')} bold />

                        <Textarea
                            label={t('Инструкция для ассистента') || ''}
                            value={formData.instruction || ''}
                            onChange={onChangeTextHandler('instruction')}
                            minRows={5}
                            multiline
                        />
                    </VStack>
                </Card>

                {/* Settings Card */}
                <Card padding={'16'} className={cls.card}>
                    <VStack gap={'16'} max>
                        <Text text={t('Настройки')} bold />

                        <ModelSelect
                            label={String(t('Модель'))}
                            value={formData.model || ''}
                            onChangeValue={onChangeSelectHandler('model')}
                        />

                        <VoiceSelect
                            label={String(t('Голос'))}
                            value={formData.voice ?? ''}
                            model={formData.model}
                            onChangeValue={onChangeSelectHandler('voice')}
                        />

                        <ToolsSelect
                            label={t('Функции') || ''}
                            value={formData.tools || []}
                            userId={userId}
                            onChangeTool={onChangeToolsHandler}
                        />

                        {/* VAD Settings */}
                        <Text text={t('Настройки VAD')} bold className={cls.vadTitle} />

                        {/* Threshold */}
                        <div className={cls.vadItem}>
                            <div className={cls.vadHeader}>
                                <div className={cls.vadLabel}>
                                    {t('Порог')}
                                    <Tooltip title={t('tooltip_threshold') || ''} arrow>
                                        <IconButton size="small">
                                            <InfoOutlinedIcon fontSize="small" className={cls.icon} />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                <span className={cls.vadValue}>{formData.turn_detection_threshold || '0.5'}</span>
                            </div>
                            <Slider
                                value={Number(formData.turn_detection_threshold) || 0.5}
                                onChange={onChangeSliderHandler('turn_detection_threshold')}
                                min={0}
                                max={1}
                                step={0.1}
                            />
                        </div>

                        {/* Prefix Padding */}
                        <div className={cls.vadItem}>
                            <div className={cls.vadHeader}>
                                <div className={cls.vadLabel}>
                                    {t('Префиксный отступ (мс)')}
                                    <Tooltip title={t('tooltip_prefix_padding') || ''} arrow>
                                        <IconButton size="small">
                                            <InfoOutlinedIcon fontSize="small" className={cls.icon} />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                <span className={cls.vadValue}>{formData.turn_detection_prefix_padding_ms || '500'}</span>
                            </div>
                            <Slider
                                value={Number(formData.turn_detection_prefix_padding_ms) || 500}
                                onChange={onChangeSliderHandler('turn_detection_prefix_padding_ms')}
                                min={0}
                                max={2000}
                                step={100}
                            />
                        </div>

                        {/* Silence Duration */}
                        <div className={cls.vadItem}>
                            <div className={cls.vadHeader}>
                                <div className={cls.vadLabel}>
                                    {t('Длительность тишины (мс)')}
                                    <Tooltip title={t('tooltip_silence_duration') || ''} arrow>
                                        <IconButton size="small">
                                            <InfoOutlinedIcon fontSize="small" className={cls.icon} />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                <span className={cls.vadValue}>{formData.turn_detection_silence_duration_ms || '1000'}</span>
                            </div>
                            <Slider
                                value={Number(formData.turn_detection_silence_duration_ms) || 1000}
                                onChange={onChangeSliderHandler('turn_detection_silence_duration_ms')}
                                min={200}
                                max={3000}
                                step={100}
                            />
                        </div>

                        {/* Idle Timeout */}
                        <div className={cls.vadItem}>
                            <div className={cls.vadHeader}>
                                <div className={cls.vadLabel}>
                                    {t('Время простоя (мс)')}
                                    <Tooltip title={t('tooltip_idle_timeout') || ''} arrow>
                                        <IconButton size="small">
                                            <InfoOutlinedIcon fontSize="small" className={cls.icon} />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                <span className={cls.vadValue}>{formData.idle_timeout_ms || '10000'}</span>
                            </div>
                            <Slider
                                value={Number(formData.idle_timeout_ms) || 10000}
                                onChange={onChangeSliderHandler('idle_timeout_ms')}
                                min={1000}
                                max={60000}
                                step={1000}
                            />
                        </div>
                    </VStack>
                </Card>
            </HStack>
        </VStack>
    )
})
