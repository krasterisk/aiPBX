import { memo, ChangeEvent, useState, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { CircularProgress, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { Workflow } from 'lucide-react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Button } from '@/shared/ui/redesign-v3/Button'
import { isUserAdmin } from '@/entities/User'
import {
    getAssistantFormData,
    STT_PROVIDERS,
    LLM_PROVIDERS,
    TTS_PROVIDERS,
    NON_REALTIME_DEFAULTS,
    getLlmModels,
    isLlmFreeText,
    getTtsVoices,
    assistantFormActions,
    useUploadTtsVoice,
} from '@/entities/Assistants'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { toast } from 'react-toastify'
// eslint-disable-next-line krasterisk-plugin/layer-imports -- Assistants → AssistantSettingsForm (shared accordion chrome)
import { SettingsAccordion } from '@/features/AssistantSettingsForm'
import cls from './PipelineCard.module.scss'

interface PipelineCardProps {
    className?: string
    assistantId?: string
}

export const isTtsUploadSupported = (provider: string | null | undefined): boolean => {
    if (!provider) return false
    const found = TTS_PROVIDERS.find(p => p.value === provider)
    return found?.supportsCustomUpload ?? false
}

export const PipelineCard = memo((props: PipelineCardProps) => {
    const {
        className,
        assistantId,
    } = props

    const { t } = useTranslation('assistants')
    const isAdmin = useSelector(isUserAdmin)
    const formFields = useSelector(getAssistantFormData)
    const dispatch = useAppDispatch()
    const [expanded, setExpanded] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadVoice, { isLoading: isUploading }] = useUploadTtsVoice()

    const isNonRealtime = formFields?.pipelineMode === 'non-realtime'

    const handlePipelineModeChange = useCallback((_: ChangeEvent<HTMLInputElement>, value: string) => {
        if (value === 'non-realtime') {
            dispatch(assistantFormActions.updateForm({
                pipelineMode: 'non-realtime',
                sttProvider: formFields?.sttProvider || NON_REALTIME_DEFAULTS.sttProvider,
                llmProvider: formFields?.llmProvider || NON_REALTIME_DEFAULTS.llmProvider,
                llmModel: formFields?.llmModel || NON_REALTIME_DEFAULTS.llmModel,
                ttsProvider: formFields?.ttsProvider || NON_REALTIME_DEFAULTS.ttsProvider,
                ttsVoice: formFields?.ttsVoice || NON_REALTIME_DEFAULTS.ttsVoice,
            }))
        } else {
            dispatch(assistantFormActions.updateForm({
                pipelineMode: null,
                sttProvider: null,
                llmProvider: null,
                llmModel: null,
                ttsProvider: null,
                ttsVoice: null,
            }))
        }
    }, [dispatch, formFields])

    const handleSttProviderChange = useCallback((_: any, newValue: { value: string } | null) => {
        dispatch(assistantFormActions.updateForm({
            sttProvider: newValue?.value || NON_REALTIME_DEFAULTS.sttProvider,
        }))
    }, [dispatch])

    const handleLlmProviderChange = useCallback((_: any, newValue: { value: string } | null) => {
        const provider = newValue?.value || NON_REALTIME_DEFAULTS.llmProvider
        const models = getLlmModels(provider)
        dispatch(assistantFormActions.updateForm({
            llmProvider: provider,
            llmModel: models.length > 0 ? models[0].value : '',
        }))
    }, [dispatch])

    const handleLlmModelChange = useCallback((_: any, newValue: { value: string } | null) => {
        dispatch(assistantFormActions.updateForm({
            llmModel: newValue?.value || '',
        }))
    }, [dispatch])

    const handleLlmModelTextChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch(assistantFormActions.updateForm({
            llmModel: e.target.value,
        }))
    }, [dispatch])

    const handleTtsProviderChange = useCallback((_: any, newValue: { value: string } | null) => {
        const provider = newValue?.value || NON_REALTIME_DEFAULTS.ttsProvider
        const voices = getTtsVoices(provider)
        dispatch(assistantFormActions.updateForm({
            ttsProvider: provider,
            ttsVoice: voices.length > 0 ? voices[0].value : '',
        }))
    }, [dispatch])

    const handleTtsVoiceChange = useCallback((_: any, newValue: { value: string } | null) => {
        dispatch(assistantFormActions.updateForm({
            ttsVoice: newValue?.value || '',
        }))
    }, [dispatch])

    const handleFileUpload = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !assistantId) return

        try {
            await uploadVoice({ id: assistantId, file }).unwrap()
            toast.success(t('Голос успешно загружен'))
        } catch {
            toast.error(t('Ошибка загрузки голоса'))
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }, [assistantId, uploadVoice, t])

    const onUploadClick = useCallback(() => {
        if (!assistantId) {
            toast.info(t('Сначала сохраните ассистента, чтобы загружать голосовые файлы'))
            return
        }
        fileInputRef.current?.click()
    }, [assistantId, t])

    const sttOptions = useMemo(() =>
        STT_PROVIDERS.map(p => ({ value: p.value, label: p.label })), [])

    const llmProviderOptions = useMemo(() =>
        LLM_PROVIDERS.map(p => ({ value: p.value, label: p.label })), [])

    const llmModelOptions = useMemo(() => {
        const provider = formFields?.llmProvider || NON_REALTIME_DEFAULTS.llmProvider
        return getLlmModels(provider).map(m => ({ value: m.value, label: m.label }))
    }, [formFields?.llmProvider])

    const ttsProviderOptions = useMemo(() =>
        TTS_PROVIDERS.map(p => ({ value: p.value, label: p.label })), [])

    const ttsVoiceOptions = useMemo(() => {
        const provider = formFields?.ttsProvider || NON_REALTIME_DEFAULTS.ttsProvider
        return getTtsVoices(provider).map(v => ({ value: v.value, label: v.label }))
    }, [formFields?.ttsProvider])

    const currentLlmIsFreeText = useMemo(() =>
        isLlmFreeText(formFields?.llmProvider || NON_REALTIME_DEFAULTS.llmProvider),
    [formFields?.llmProvider])

    const currentTtsSupportsUpload = useMemo(() =>
        isTtsUploadSupported(formFields?.ttsProvider),
    [formFields?.ttsProvider])

    const isLlmAudioNative = formFields?.llmProvider === 'gemma4-audio'

    if (!isAdmin) {
        return null
    }

    const radioSx = {
        color: 'var(--hint-redesigned)',
        '&.Mui-checked': {
            color: 'var(--accent-redesigned)',
        },
    }

    const labelSx = {
        '.MuiFormControlLabel-label': {
            color: 'var(--text-redesigned)',
            fontSize: '14px',
        },
    }

    return (
        <div
            className={classNames(cls.PipelineCard, {}, [className])}
            data-testid="PipelineCard"
        >
            <SettingsAccordion
                id="assistant-pipeline"
                title={String(t('Режим работы') ?? '')}
                icon={Workflow}
                expanded={expanded}
                onChange={setExpanded}
                detailsClassName={cls.details}
            >
                    <p className={cls.adminHint}>{t('Доступно только администраторам')}</p>

                    <FormControl className={cls.fullWidth}>
                        <RadioGroup
                            value={isNonRealtime ? 'non-realtime' : 'realtime'}
                            onChange={handlePipelineModeChange}
                        >
                            <FormControlLabel
                                value="realtime"
                                control={<Radio size="small" sx={radioSx} />}
                                label={t('Realtime (потоковый)')}
                                sx={labelSx}
                            />
                            <FormControlLabel
                                value="non-realtime"
                                control={<Radio size="small" sx={radioSx} />}
                                label={t('Non-Realtime (STT → LLM → TTS)')}
                                sx={labelSx}
                            />
                        </RadioGroup>
                    </FormControl>

                    {isNonRealtime && (
                        <div className={cls.fields}>
                            <Combobox
                                label={t('Провайдер распознавания речи') ?? ''}
                                options={sttOptions}
                                value={sttOptions.find(o => o.value === (formFields?.sttProvider || NON_REALTIME_DEFAULTS.sttProvider)) || null}
                                onChange={handleSttProviderChange}
                                getOptionLabel={(option: { label: string }) => option.label}
                                isOptionEqualToValue={(option: { value: string }, val: { value: string }) => option.value === val.value}
                                fullWidth
                                disabled={isLlmAudioNative}
                            />
                            {isLlmAudioNative && (
                                <p className={cls.helperText}>
                                    {t('STT транскрипция отключена (аудио обрабатывается локально в Audio-Native модели)')}
                                </p>
                            )}

                            <Combobox
                                label={t('Провайдер языковой модели') ?? ''}
                                options={llmProviderOptions}
                                value={llmProviderOptions.find(o => o.value === (formFields?.llmProvider || NON_REALTIME_DEFAULTS.llmProvider)) || null}
                                onChange={handleLlmProviderChange}
                                getOptionLabel={(option: { label: string }) => option.label}
                                isOptionEqualToValue={(option: { value: string }, val: { value: string }) => option.value === val.value}
                                fullWidth
                            />

                            {currentLlmIsFreeText
                                ? (
                                    <Textarea
                                        label={t('Модель LLM') ?? ''}
                                        value={formFields?.llmModel || ''}
                                        onChange={handleLlmModelTextChange}
                                        placeholder={t('Введите название модели') ?? 'llama3.1:8b'}
                                        minRows={1}
                                    />
                                    )
                                : (
                                    <Combobox
                                        label={t('Модель LLM') ?? ''}
                                        options={llmModelOptions}
                                        value={llmModelOptions.find(o => o.value === (formFields?.llmModel || NON_REALTIME_DEFAULTS.llmModel)) || null}
                                        onChange={handleLlmModelChange}
                                        getOptionLabel={(option: { label: string }) => option.label}
                                        isOptionEqualToValue={(option: { value: string }, val: { value: string }) => option.value === val.value}
                                        fullWidth
                                    />
                                    )}

                            <Combobox
                                label={t('Провайдер синтеза речи') ?? ''}
                                options={ttsProviderOptions}
                                value={ttsProviderOptions.find(o => o.value === (formFields?.ttsProvider || NON_REALTIME_DEFAULTS.ttsProvider)) || null}
                                onChange={handleTtsProviderChange}
                                getOptionLabel={(option: { label: string }) => option.label}
                                isOptionEqualToValue={(option: { value: string }, val: { value: string }) => option.value === val.value}
                                fullWidth
                            />

                            <Combobox
                                label={t('Голос TTS') ?? ''}
                                options={ttsVoiceOptions}
                                value={ttsVoiceOptions.find(o => o.value === (formFields?.ttsVoice || NON_REALTIME_DEFAULTS.ttsVoice)) || null}
                                onChange={handleTtsVoiceChange}
                                getOptionLabel={(option: { label: string }) => option.label}
                                isOptionEqualToValue={(option: { value: string }, val: { value: string }) => option.value === val.value}
                                fullWidth
                            />

                            {currentTtsSupportsUpload && (
                                <div className={cls.uploadContainer}>
                                    <p className={cls.helperText}>
                                        {t('Или загрузите эталонный .wav файл для клонирования (5-10 сек)')}
                                    </p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        accept=".wav"
                                        onChange={handleFileUpload}
                                    />
                                    {!isUploading
                                        ? (
                                            <Button variant="outline" onClick={onUploadClick}>
                                                {t('Загрузить .wav эталон')}
                                            </Button>
                                            )
                                        : (
                                            <CircularProgress size={24} />
                                            )}
                                    {formFields?.ttsVoice && formFields?.ttsVoice !== 'default' && (
                                        <p className={cls.helperText}>
                                            {t('Активный голос: записан из файла')}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
            </SettingsAccordion>
        </div>
    )
})
