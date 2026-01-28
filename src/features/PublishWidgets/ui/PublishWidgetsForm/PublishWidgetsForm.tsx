import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishWidgetsForm.module.scss'
import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { AssistantSelect, AssistantOptions } from '@/entities/Assistants'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Button } from '@/shared/ui/redesigned/Button'
import { Card } from '@/shared/ui/redesigned/Card'
import { Check } from '@/shared/ui/mui/Check'
import {
    getPublishWidgetsFormName,
    getPublishWidgetsFormSelectedAssistant,
    getPublishWidgetsFormAllowedDomains,
    getPublishWidgetsFormMaxSessions,
    getPublishWidgetsFormAppearance
} from '../../model/selectors/publishWidgetsFormSelectors'
import { publishWidgetsFormActions } from '../../model/slices/publishWidgetsFormSlice'
import { isUserAdmin, getUserAuthData } from '@/entities/User'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'
import { useNavigate } from 'react-router-dom'
import { getRoutePublishWidgets } from '@/shared/const/router'
import { useCreateWidgetKey, useUpdateWidgetKey } from '@/entities/WidgetKeys'
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    TextField
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface PublishWidgetsFormProps {
    className?: string
    isEdit?: boolean
    widgetId?: string
}

export const PublishWidgetsForm = memo((props: PublishWidgetsFormProps) => {
    const { className, isEdit, widgetId } = props
    const { t } = useTranslation('publish-widgets')
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const name = useSelector(getPublishWidgetsFormName)
    const selectedAssistant = useSelector(getPublishWidgetsFormSelectedAssistant)
    const allowedDomains = useSelector(getPublishWidgetsFormAllowedDomains)
    const maxSessions = useSelector(getPublishWidgetsFormMaxSessions)
    const appearance = useSelector(getPublishWidgetsFormAppearance)
    const isAdmin = useSelector(isUserAdmin)
    const userData = useSelector(getUserAuthData)

    const [createWidget, { isLoading: isCreating }] = useCreateWidgetKey()
    const [updateWidget, { isLoading: isUpdating }] = useUpdateWidgetKey()
    const isLoading = isCreating || isUpdating

    const onChangeName = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => dispatch(publishWidgetsFormActions.setName(e.target.value)), [dispatch])
    const onChangeAssistant = useCallback((_: any, v: AssistantOptions | null) => dispatch(publishWidgetsFormActions.setSelectedAssistant(v)), [dispatch])
    const onChangeDomains = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(publishWidgetsFormActions.setAllowedDomains(e.target.value.split('\n')))
    }, [dispatch])

    const onChangeMaxSessions = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => dispatch(publishWidgetsFormActions.setMaxConcurrentSessions(Number(e.target.value))), [dispatch])
    const onChangeAppearance = useCallback((field: any, value: any) => dispatch(publishWidgetsFormActions.setAppearance({ [field]: value })), [dispatch])

    const onCancel = useCallback(() => navigate(getRoutePublishWidgets()), [navigate])

    const onSave = useCallback(async () => {
        if (!name || !selectedAssistant) {
            toast.error(t('Пожалуйста заполни обязательные поля'))
            return
        }

        const data = {
            name,
            assistantId: Number(selectedAssistant.id),
            allowedDomains: JSON.stringify(allowedDomains.map(d => d.trim()).filter(Boolean)),
            maxConcurrentSessions: maxSessions,
            // appearance // if intended to send
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
    }, [name, selectedAssistant, allowedDomains, maxSessions, isEdit, widgetId, updateWidget, createWidget, navigate, dispatch, t])

    return (
        <Card padding={'24'} max className={classNames(cls.PublishWidgetsForm, {}, [className])}>
            <VStack gap={'24'} max>
                <div className={cls.formGrid}>
                    <VStack gap="16" max>
                        <AssistantSelect
                            label={t('AI Ассистент') || ''}
                            value={selectedAssistant}
                            onChangeAssistant={onChangeAssistant}
                            userId={isAdmin ? undefined : userData?.id}
                        />

                        <Textarea
                            label={t('Название виджета') || ''}
                            value={name}
                            onChange={onChangeName}
                            placeholder={t('Напр. Служба поддержки') || ''}
                        />

                        <TextField
                            fullWidth
                            label={t('Максимум сессий')}
                            type="number"
                            value={maxSessions}
                            onChange={onChangeMaxSessions}
                        />

                        <Textarea
                            label={t('Разрешённые домены') || ''}
                            value={allowedDomains.join('\n')}
                            onChange={onChangeDomains}
                            placeholder="example.com"
                        />
                    </VStack>

                    {appearance && (
                        <VStack gap="16" max>
                            <Text text={t('Настройки внешнего вида')} bold />
                            <Accordion className={cls.accordion} defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    {t('Кнопка и тема')}
                                </AccordionSummary>
                                <AccordionDetails>
                                    <VStack gap="16" max>
                                        <FormControl fullWidth>
                                            <InputLabel>{t('Позиция')}</InputLabel>
                                            <Select
                                                value={appearance.buttonPosition}
                                                onChange={(e) => onChangeAppearance('buttonPosition', e.target.value)}
                                                label={t('Позиция')}
                                            >
                                                <MenuItem value="bottom-right">{t('Внизу справа')}</MenuItem>
                                                <MenuItem value="bottom-left">{t('Внизу слева')}</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <TextField
                                            fullWidth
                                            label={t('Цвет кнопки')}
                                            type="color"
                                            value={appearance.buttonColor}
                                            onChange={(e) => onChangeAppearance('buttonColor', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                        />

                                        <Check
                                            label={t('Показать брендинг') || ''}
                                            checked={appearance.showBranding}
                                            onChange={(e) => onChangeAppearance('showBranding', e.target.checked)}
                                        />
                                    </VStack>
                                </AccordionDetails>
                            </Accordion>
                        </VStack>
                    )}
                </div>

                <HStack justify={'end'} gap={'8'} max>
                    <Button variant={'outline'} onClick={onCancel}>
                        {t('Отмена')}
                    </Button>
                    <Button onClick={onSave} disabled={isLoading}>
                        {isEdit ? t('Сохранить изменения') : t('Создать виджет')}
                    </Button>
                </HStack>
            </VStack>
        </Card>
    )
})
