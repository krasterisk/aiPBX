import { memo, ChangeEvent, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { classNames } from '@/shared/lib/classNames/classNames'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { isUserAdmin } from '@/entities/User'
import {
    Assistant,
    getAssistantFormData,
    STT_PROVIDERS,
    LLM_PROVIDERS,
    TTS_PROVIDERS,
    NON_REALTIME_DEFAULTS,
    getLlmModels,
    isLlmFreeText,
    getTtsVoices
, assistantFormActions 
} from '@/entities/Assistants'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'

import { Collapse, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import { Button } from '@/shared/ui/redesign-v3/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SettingsIcon from '@mui/icons-material/Settings'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import RouteIcon from '@mui/icons-material/Route'
import cls from './SpeechSettingsCard.module.scss'

interface SpeechSettingsCardProps {
    className?: string
    onChangeTextHandler?: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onChangeSelectHandler?: (field: keyof Assistant) => (event: any, newValue: string) => void
}

export const SpeechSettingsCard = memo((props: SpeechSettingsCardProps) => {
    const {
        className,
        onChangeTextHandler,
        onChangeSelectHandler
    } = props

    const { t } = useTranslation('assistants')
    const isAdmin = useSelector(isUserAdmin)
    const formFields = useSelector(getAssistantFormData)
    const dispatch = useAppDispatch()
    const [expanded, setExpanded] = useState(false)

    const isNonRealtime = formFields?.pipelineMode === 'non-realtime'

    const handleExpandClick = useCallback(() => {
        setExpanded((prev) => !prev)
    }, [])

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

    // Memoized options
    const sttOptions = useMemo(() =>
        STT_PROVIDERS.map(p => ({ value: p.value, label: p.label })), []
    )

    const llmProviderOptions = useMemo(() =>
        LLM_PROVIDERS.map(p => ({ value: p.value, label: p.label })), []
    )

    const llmModelOptions = useMemo(() => {
        const provider = formFields?.llmProvider || NON_REALTIME_DEFAULTS.llmProvider
        return getLlmModels(provider).map(m => ({ value: m.value, label: m.label }))
    }, [formFields?.llmProvider])

    const ttsProviderOptions = useMemo(() =>
        TTS_PROVIDERS.map(p => ({ value: p.value, label: p.label })), []
    )

    const ttsVoiceOptions = useMemo(() => {
        const provider = formFields?.ttsProvider || NON_REALTIME_DEFAULTS.ttsProvider
        return getTtsVoices(provider).map(v => ({ value: v.value, label: v.label }))
    }, [formFields?.ttsProvider])

    const currentLlmIsFreeText = useMemo(() =>
        isLlmFreeText(formFields?.llmProvider || NON_REALTIME_DEFAULTS.llmProvider),
        [formFields?.llmProvider]
    )

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
        }
    }

    return (
        <div className={classNames(cls.SpeechSettingsCard, {}, [className])}>
            <HStack
                max
                justify="between"
                align="center"
                className={cls.header}
                onClick={handleExpandClick}
            >
                <HStack gap="8" align="center">
                    <AdminPanelSettingsIcon className={cls.adminIcon} fontSize="small" />
                    <Text
                        title={t('Расширенные настройки')}
                        className={cls.cardTitle}
                        bold
                    />
                </HStack>

                <Button
                    className={classNames(cls.expandButton, { [cls.expanded]: expanded })}
                    aria-expanded={expanded}
                    aria-label={t('Показать больше') || 'Show more'}
                    size="m"
                    variant="clear"
                    square
                >
                    <ExpandMoreIcon />
                </Button>
            </HStack>

            <Text
                text={t('Доступно только администраторам')}
                className={cls.adminHint}
                size="s"
            />

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <VStack max gap="16" className={cls.content}>
                    {/* Pipeline Mode Section */}
                    <div className={cls.section}>
                        <HStack gap="8" align="center" className={cls.sectionHeader}>
                            <RouteIcon className={cls.sectionIcon} fontSize="small" />
                            <Text
                                text={t('Режим работы')}
                                className={cls.sectionTitle}
                                bold
                            />
                        </HStack>

                        <FormControl>
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
                    </div>

                    {/* Non-Realtime Pipeline Settings */}
                    <Collapse in={isNonRealtime} timeout="auto" unmountOnExit>
                        <div className={cls.section} style={{ marginTop: 0 }}>
                            <HStack gap="8" align="center" className={cls.sectionHeader}>
                                <Text
                                    text={t('Non-Realtime Pipeline')}
                                    className={cls.sectionTitle}
                                    bold
                                />
                            </HStack>

                            <VStack max gap="12">
                                {/* STT Provider */}
                                <Combobox
                                    label={t('Провайдер распознавания речи') ?? ''}
                                    options={sttOptions}
                                    value={sttOptions.find(o => o.value === (formFields?.sttProvider || NON_REALTIME_DEFAULTS.sttProvider)) || null}
                                    onChange={handleSttProviderChange}
                                    getOptionLabel={(option: { label: string }) => option.label}
                                    isOptionEqualToValue={(option: { value: string }, val: { value: string }) => option.value === val.value}
                                    fullWidth
                                />

                                {/* LLM Provider */}
                                <Combobox
                                    label={t('Провайдер языковой модели') ?? ''}
                                    options={llmProviderOptions}
                                    value={llmProviderOptions.find(o => o.value === (formFields?.llmProvider || NON_REALTIME_DEFAULTS.llmProvider)) || null}
                                    onChange={handleLlmProviderChange}
                                    getOptionLabel={(option: { label: string }) => option.label}
                                    isOptionEqualToValue={(option: { value: string }, val: { value: string }) => option.value === val.value}
                                    fullWidth
                                />

                                {/* LLM Model */}
                                {currentLlmIsFreeText ? (
                                    <Textarea
                                        label={t('Модель LLM') ?? ''}
                                        value={formFields?.llmModel || ''}
                                        onChange={handleLlmModelTextChange}
                                        placeholder={t('Введите название модели') ?? 'llama3.1:8b'}
                                        minRows={1}
                                    />
                                ) : (
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

                                {/* TTS Provider */}
                                <Combobox
                                    label={t('Провайдер синтеза речи') ?? ''}
                                    options={ttsProviderOptions}
                                    value={ttsProviderOptions.find(o => o.value === (formFields?.ttsProvider || NON_REALTIME_DEFAULTS.ttsProvider)) || null}
                                    onChange={handleTtsProviderChange}
                                    getOptionLabel={(option: { label: string }) => option.label}
                                    isOptionEqualToValue={(option: { value: string }, val: { value: string }) => option.value === val.value}
                                    fullWidth
                                />

                                {/* TTS Voice */}
                                <Combobox
                                    label={t('Голос TTS') ?? ''}
                                    options={ttsVoiceOptions}
                                    value={ttsVoiceOptions.find(o => o.value === (formFields?.ttsVoice || NON_REALTIME_DEFAULTS.ttsVoice)) || null}
                                    onChange={handleTtsVoiceChange}
                                    getOptionLabel={(option: { label: string }) => option.label}
                                    isOptionEqualToValue={(option: { value: string }, val: { value: string }) => option.value === val.value}
                                    fullWidth
                                />
                            </VStack>
                        </div>
                    </Collapse>

                    {/* Model Parameters Section */}
                    <div className={cls.section}>
                        <HStack gap="8" align="center" className={cls.sectionHeader}>
                            <SettingsIcon className={cls.sectionIcon} fontSize="small" />
                            <Text
                                text={t('Параметры модели')}
                                className={cls.sectionTitle}
                                bold
                            />
                        </HStack>

                        <VStack max gap="12">
                            <Textarea
                                label={t('Максимальное количество токенов в ответе') ?? ''}
                                onChange={onChangeTextHandler?.('max_response_output_tokens')}
                                data-testid="AssistantForm.max_response_output_tokens"
                                value={formFields?.max_response_output_tokens || ''}
                                minRows={1}
                                placeholder="4096/inf"
                            />
                        </VStack>
                    </div>

                    {/* Speech Synthesis & Recognition Section */}
                    <div className={cls.section}>
                        <HStack gap="8" align="center" className={cls.sectionHeader}>
                            <Text
                                text={t('Синтез и распознавание речи')}
                                className={cls.sectionTitle}
                                bold
                            />
                        </HStack>

                        <VStack max gap="12">
                            <Textarea
                                label={t('Модель распознавания речи') ?? ''}
                                onChange={onChangeTextHandler?.('input_audio_transcription_model')}
                                data-testid="AssistantForm.input_audio_transcription_model"
                                value={formFields?.input_audio_transcription_model || ''}
                                minRows={1}
                            />

                            <Textarea
                                label={t('Язык распознавания речи') ?? ''}
                                onChange={onChangeTextHandler?.('input_audio_transcription_language')}
                                data-testid="AssistantForm.input_audio_transcription_language"
                                value={formFields?.input_audio_transcription_language || ''}
                                minRows={1}
                            />

                            <Textarea
                                label={t('Модель синтеза речи') ?? ''}
                                onChange={onChangeTextHandler?.('output_audio_transcription_model')}
                                data-testid="AssistantForm.output_audio_transcription_model"
                                value={formFields?.output_audio_transcription_model || ''}
                                minRows={1}
                            />
                        </VStack>
                    </div>

                    {/* Audio Streams Section — hidden in non-realtime mode */}
                    {!isNonRealtime && (
                        <div className={cls.section}>
                            <Text
                                text={t('Аудио потоки')}
                                className={cls.sectionTitle}
                                bold
                            />

                            <VStack max gap="12">
                                <Textarea
                                    label={t('Формат входящего аудио') ?? ''}
                                    onChange={onChangeTextHandler?.('input_audio_format')}
                                    data-testid="AssistantForm.input_audio_format"
                                    value={formFields?.input_audio_format || ''}
                                    minRows={1}
                                />

                                <Textarea
                                    label={t('Формат исходящего аудио') ?? ''}
                                    onChange={onChangeTextHandler?.('output_audio_format')}
                                    data-testid="AssistantForm.output_audio_format"
                                    value={formFields?.output_audio_format || ''}
                                    minRows={1}
                                />

                                <Textarea
                                    label={t('Тип определения шума (none, near_field, far_field)') ?? ''}
                                    onChange={onChangeTextHandler?.('input_audio_noise_reduction')}
                                    data-testid="AssistantForm.input_audio_noise_reduction"
                                    value={formFields?.input_audio_noise_reduction || ''}
                                    minRows={1}
                                />
                            </VStack>
                        </div>
                    )}

                    {/* Advanced VAD Section */}
                    <div className={cls.section}>
                        <Text
                            text={t('Автоматическое обнаружение голоса (VAD)')}
                            className={cls.sectionTitle}
                            bold
                        />

                        <VStack max gap="12">
                            <Textarea
                                label={t('Тип VAD') ?? ''}
                                onChange={onChangeTextHandler?.('turn_detection_type')}
                                data-testid="AssistantForm.turn_detection_type"
                                value={formFields?.turn_detection_type || ''}
                                minRows={1}
                            />

                            {/* Semantic eagerness hidden in non-realtime mode */}
                            {!isNonRealtime && (
                                <Textarea
                                    label={t('Семантический VAD') ?? ''}
                                    onChange={onChangeTextHandler?.('semantic_eagerness')}
                                    data-testid="AssistantForm.semantic_eagerness"
                                    value={formFields?.semantic_eagerness || ''}
                                    minRows={1}
                                />
                            )}
                        </VStack>
                    </div>
                </VStack>
            </Collapse>
        </div>
    )
})
