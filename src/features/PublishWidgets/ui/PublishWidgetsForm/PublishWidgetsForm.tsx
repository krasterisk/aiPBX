import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishWidgetsForm.module.scss'
import { memo, useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { AssistantSelect, AssistantOptions } from '@/entities/Assistants'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Card } from '@/shared/ui/redesigned/Card'
import { Check } from '@/shared/ui/mui/Check'
import { PbxServerSelect, PbxServerOptions, usePbxServersAll } from '@/entities/PbxServers'
import {
    getPublishWidgetsFormName,
    getPublishWidgetsFormSelectedAssistant,
    getPublishWidgetsFormSelectedPbxServer,
    getPublishWidgetsFormAllowedDomains,
    getPublishWidgetsFormMaxSessions,
    getPublishWidgetsFormMaxSessionDuration,
    getPublishWidgetsFormIsActive,
    getPublishWidgetsFormAppearance
} from '../../model/selectors/publishWidgetsFormSelectors'
import { publishWidgetsFormActions } from '../../model/slices/publishWidgetsFormSlice'
import { isUserAdmin, getUserAuthData } from '@/entities/User'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'
import { useNavigate } from 'react-router-dom'
import { getRoutePublishWidgets } from '@/shared/const/router'
import { useCreateWidgetKey, useUpdateWidgetKey } from '@/entities/WidgetKeys'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { useMemo } from 'react'
import { PublishWidgetsFormHeader } from '../PublishWidgetsFormHeader/PublishWidgetsFormHeader'

interface PublishWidgetsFormProps {
    className?: string
    isEdit?: boolean
    widgetId?: string
}

interface ListBoxItemsProps {
    appearance: any
    onChangeAppearance: (field: string, value: unknown) => void
}

const ListBoxItems = memo(({ appearance, onChangeAppearance }: ListBoxItemsProps) => {
    const { t } = useTranslation('publish-widgets')

    const positionOptions = useMemo(() => [
        { label: t('Внизу справа'), value: 'bottom-right' },
        { label: t('Внизу слева'), value: 'bottom-left' },
        { label: t('Вверху справа'), value: 'top-right' },
        { label: t('Вверху слева'), value: 'top-left' },
    ], [t])

    const themeOptions = useMemo(() => [
        { label: t('Светлая'), value: 'light' },
        { label: t('Темная'), value: 'dark' },
        { label: t('Автоматически'), value: 'auto' },
    ], [t])

    return (
        <VStack gap="16" max>
            <Combobox
                label={t('Позиция кнопки') || ''}
                options={positionOptions}
                getOptionLabel={(opt) => opt.label}
                value={positionOptions.find(opt => opt.value === appearance.buttonPosition)}
                onChange={(_, newValue) => newValue && onChangeAppearance('buttonPosition', newValue.value)}
                isOptionEqualToValue={(opt, val) => opt.value === val.value}
                disableClearable
                renderInput={(params) => (
                    <Textarea
                        {...params}
                        label={t('Позиция кнопки')}
                        inputProps={{ ...params.inputProps, readOnly: true }}
                    />
                )}
            />

            <Textarea
                label={t('Цвет кнопки') || ''}
                type="color"
                value={appearance.buttonColor}
                onChange={(e) => onChangeAppearance('buttonColor', e.target.value)}
            />

            <Textarea
                label={t('Основной цвет') || ''}
                type="color"
                value={appearance.primaryColor}
                onChange={(e) => onChangeAppearance('primaryColor', e.target.value)}
            />

            <Combobox
                label={t('Тема') || ''}
                options={themeOptions}
                getOptionLabel={(opt) => opt.label}
                value={themeOptions.find(opt => opt.value === appearance.theme)}
                onChange={(_, newValue) => newValue && onChangeAppearance('theme', newValue.value)}
                isOptionEqualToValue={(opt, val) => opt.value === val.value}
                disableClearable
                renderInput={(params) => (
                    <Textarea
                        {...params}
                        label={t('Тема')}
                        inputProps={{ ...params.inputProps, readOnly: true }}
                    />
                )}
            />

            <Check
                label={t('Показать брендинг') || ''}
                checked={appearance.showBranding}
                onChange={(e) => onChangeAppearance('showBranding', e.target.checked)}
            />
        </VStack>
    )
})

export const PublishWidgetsForm = memo((props: PublishWidgetsFormProps) => {
    const { className, isEdit, widgetId } = props
    const { t } = useTranslation('publish-widgets')
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const name = useSelector(getPublishWidgetsFormName)
    const selectedAssistant = useSelector(getPublishWidgetsFormSelectedAssistant)
    const selectedPbxServer = useSelector(getPublishWidgetsFormSelectedPbxServer)
    const allowedDomains = useSelector(getPublishWidgetsFormAllowedDomains)
    const maxSessions = useSelector(getPublishWidgetsFormMaxSessions)
    const maxSessionDuration = useSelector(getPublishWidgetsFormMaxSessionDuration)
    const isActive = useSelector(getPublishWidgetsFormIsActive)
    const appearance = useSelector(getPublishWidgetsFormAppearance)
    const isAdmin = useSelector(isUserAdmin)
    const userData = useSelector(getUserAuthData)

    const [createWidget, { isLoading: isCreating }] = useCreateWidgetKey()
    const [updateWidget, { isLoading: isUpdating }] = useUpdateWidgetKey()
    const isLoading = isCreating || isUpdating

    const [showPreview, setShowPreview] = useState(false)

    // Fetch servers to enrich the selected server data (e.g. wss_url) which might be missing in widget data
    const { data: allPbxServers } = usePbxServersAll(null)

    useEffect(() => {
        if (selectedPbxServer && !selectedPbxServer.wss_url && allPbxServers) {
            const fullServerData = allPbxServers.find(s => String(s.id) === String(selectedPbxServer.id))
            if (fullServerData) {
                dispatch(publishWidgetsFormActions.setSelectedPbxServer({
                    id: String(fullServerData.id),
                    name: fullServerData.name || '',
                    wss_url: fullServerData.wss_url,
                    uniqueId: fullServerData.uniqueId
                }))
            }
        }
    }, [selectedPbxServer, allPbxServers, dispatch])

    const onChangeName = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => dispatch(publishWidgetsFormActions.setName(e.target.value)),
        [dispatch]
    )

    const onChangeAssistant = useCallback(
        (_: unknown, v: AssistantOptions | null) => dispatch(publishWidgetsFormActions.setSelectedAssistant(v)),
        [dispatch]
    )

    const onChangePbxServer = useCallback(
        (_: unknown, v: PbxServerOptions | null) => dispatch(publishWidgetsFormActions.setSelectedPbxServer(v)),
        [dispatch]
    )

    const onChangeDomains = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            dispatch(publishWidgetsFormActions.setAllowedDomains(e.target.value))
        },
        [dispatch]
    )

    const onChangeMaxSessions = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            dispatch(publishWidgetsFormActions.setMaxConcurrentSessions(Number(e.target.value))),
        [dispatch]
    )

    const onChangeMaxSessionDuration = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            dispatch(publishWidgetsFormActions.setMaxSessionDuration(Number(e.target.value))),
        [dispatch]
    )

    const onChangeIsActive = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => dispatch(publishWidgetsFormActions.setIsActive(e.target.checked)),
        [dispatch]
    )

    const onChangeAppearance = useCallback(
        (field: string, value: unknown) => dispatch(publishWidgetsFormActions.setAppearance({ [field]: value })),
        [dispatch]
    )

    const onSave = useCallback(async () => {
        if (!name || !selectedAssistant) {
            toast.error(t('Пожалуйста заполните обязательные поля'))
            return
        }

        if (!selectedPbxServer) {
            toast.error(t('Пожалуйста выберите PBX сервер'))
            return
        }

        if (!selectedPbxServer.wss_url) {
            toast.error(t('У выбранного PBX сервера не указан WSS URL'))
            return
        }

        const domainsArray = allowedDomains
            .split(/[\n,]/)
            .map(d => d.trim())
            .filter(Boolean)

        const data = {
            name,
            assistantId: Number(selectedAssistant.id),
            pbxServerId: selectedPbxServer ? Number(selectedPbxServer.id) : undefined,
            allowedDomains: JSON.stringify(domainsArray),
            maxConcurrentSessions: maxSessions,
            maxSessionDuration,
            isActive
        }

        try {
            if (isEdit && widgetId) {
                await updateWidget({ id: Number(widgetId), ...data }).unwrap()
                toast.success(t('Виджет успешно обновлен'))
            } else {
                await createWidget(data).unwrap()
                toast.success(t('Виджет успешно создан'))
            }
            navigate(getRoutePublishWidgets())
            dispatch(publishWidgetsFormActions.resetForm())
        } catch (e) {
            toast.error(getErrorMessage(e))
        }
    }, [name, selectedAssistant, selectedPbxServer, allowedDomains, maxSessions, maxSessionDuration, isActive, isEdit, widgetId, updateWidget, createWidget, navigate, dispatch, t])

    useEffect(() => {
        if (showPreview && appearance) {
            const iframe = document.getElementById('widget-preview') as HTMLIFrameElement
            if (iframe?.contentWindow) {
                iframe.contentWindow.postMessage({
                    type: 'UPDATE_APPEARANCE',
                    appearance
                }, '*')
            }
        }
    }, [appearance, showPreview])

    return (
        <VStack gap={'8'} max className={classNames(cls.PublishWidgetsForm, {}, [className])}>
            <PublishWidgetsFormHeader
                onSave={onSave}
                isEdit={isEdit}
                isLoading={isLoading}
            />

            <Card padding={'24'} max border={'partial'}>
                <VStack gap={'24'} max>
                    <div className={cls.formGrid}>
                        {/* Left Column - Main Settings */}
                        <VStack gap="16" max>
                            <Text text={t('Основные настройки')} bold />

                            <AssistantSelect
                                key={selectedAssistant?.id}
                                label={t('AI Ассистент') || ''}
                                value={selectedAssistant}
                                onChangeAssistant={onChangeAssistant}
                                userId={isAdmin ? undefined : userData?.id}
                            />

                            <PbxServerSelect
                                label={t('PBX Сервер') || ''}
                                value={selectedPbxServer}
                                onChangePbxServer={onChangePbxServer}
                                userId={isAdmin ? undefined : userData?.id}
                            />

                            <Textarea
                                label={t('Название виджета') || ''}
                                value={name}
                                onChange={onChangeName}
                                placeholder={t('Напр. Служба поддержки') || ''}
                                rows={2}
                            />

                            <Textarea
                                label={t('Максимум сессий') || ''}
                                type="number"
                                value={maxSessions}
                                onChange={onChangeMaxSessions}
                                helperText={t('Максимальное количество одновременных сессий')}
                                inputProps={{ min: 1, max: 100 }}
                            />

                            <Textarea
                                label={t('Длительность сессии (сек)') || ''}
                                type="number"
                                value={maxSessionDuration}
                                onChange={onChangeMaxSessionDuration}
                                helperText={t('Максимальная длительность сессии в секундах (60-3600)')}
                                inputProps={{ min: 60, max: 3600 }}
                            />

                            <Textarea
                                multiline
                                minRows={3}
                                maxRows={10}
                                label={t('Разрешённые домены') || ''}
                                value={allowedDomains}
                                onChange={onChangeDomains}
                                placeholder={'example.com\nwww.example.com\n*.example.com'}
                                helperText={t('По одному домену на строку. Можно вводить через запятую или с новой строки') || ''}
                            />

                            <Check
                                label={t('Виджет активен') || ''}
                                checked={isActive}
                                onChange={onChangeIsActive}
                            />
                        </VStack>

                        {/* Right Column - Appearance Settings & Preview */}
                        <VStack gap="16" max>
                            <HStack justify={'between'} max>
                                <Text text={t('Настройки внешнего вида')} bold />
                                <Check
                                    label={t('Показать превью') || ''}
                                    checked={showPreview}
                                    onChange={(e) => setShowPreview(e.target.checked)}
                                />
                            </HStack>

                            {appearance && (
                                <ListBoxItems appearance={appearance} onChangeAppearance={onChangeAppearance} />
                            )}

                            {/* Preview Panel */}
                            {showPreview && (
                                <Card padding={'16'} className={cls.previewCard}>
                                    <VStack gap={'8'} max>
                                        <Text text={t('Предпросмотр виджета')} size={'s'} bold />
                                        <div className={cls.previewContainer}>
                                            <iframe
                                                id="widget-preview"
                                                className={cls.previewIframe}
                                                title={t('Предпросмотр виджета') || 'Widget Preview'}
                                                srcDoc={`
                                                    <!DOCTYPE html>
                                                    <html>
                                                    <head>
                                                        <style>
                                                            body { margin: 0; padding: 20px; background: #f5f5f5; font-family: sans-serif; }
                                                            .preview-text { text-align: center; color: #666; margin-bottom: 20px; }
                                                            .widget-button {
                                                                position: fixed;
                                                                ${appearance?.buttonPosition.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
                                                                ${appearance?.buttonPosition.includes('right') ? 'right: 20px;' : 'left: 20px;'}
                                                                width: 60px;
                                                                height: 60px;
                                                                border-radius: 50%;
                                                                background: ${appearance?.buttonColor};
                                                                border: none;
                                                                cursor: pointer;
                                                                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                                color: white;
                                                                font-size: 24px;
                                                                transition: transform 0.2s;
                                                            }
                                                            .widget-button:hover {
                                                                transform: scale(1.1);
                                                            }
                                                        </style>
                                                    </head>
                                                    <body>
                                                        <div class="preview-text">${t('Это предпросмотр виджета')}</div>
                                                        <button class="widget-button">🎤</button>
                                                    </body>
                                                    </html>
                                                `}
                                            />
                                        </div>
                                    </VStack>
                                </Card>
                            )}
                        </VStack>
                    </div>
                </VStack>
            </Card>

            <PublishWidgetsFormHeader
                onSave={onSave}
                isEdit={isEdit}
                isLoading={isLoading}
                variant={'diviner-bottom'}
            />
        </VStack>
    )
})
