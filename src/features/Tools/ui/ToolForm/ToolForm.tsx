import { memo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { classNames } from '@/shared/lib/classNames/classNames'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Loader } from '@/shared/ui/Loader'
import { useMediaQuery } from '@mui/material'
import { toast } from 'react-toastify'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'

import {
    Tool,
    toolsPageActions,
    getToolsEditForm,
    getToolsCreateForm,
    useTool,
    useCreateTool,
    useUpdateTool,
    useDeleteTool,
    toolsPageReducer
} from '@/entities/Tools'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { getRouteTools } from '@/shared/const/router'

import { ToolFormHeader } from './components/ToolFormHeader/ToolFormHeader'
import { GeneralToolCard } from './components/GeneralToolCard/GeneralToolCard'
import { FunctionToolCard } from './components/FunctionToolCard/FunctionToolCard'
import cls from './ToolForm.module.scss'

interface ToolFormProps {
    className?: string
    toolId?: string
    isEdit?: boolean
}

const reducers: ReducersList = {
    toolsPage: toolsPageReducer
}

export const ToolForm = memo((props: ToolFormProps) => {
    const { className, toolId, isEdit } = props
    const { t } = useTranslation('tools')
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const isMobile = useMediaQuery('(max-width:1000px)')

    const isAdmin = useSelector(isUserAdmin)
    const authData = useSelector(getUserAuthData)

    // Select the correct form data based on mode
    const formFields = useSelector(isEdit ? getToolsEditForm : getToolsCreateForm)

    const { data: tool, isLoading: isToolLoading } = useTool(toolId!, { skip: !isEdit || !toolId })
    const [createTool, { isLoading: isCreating }] = useCreateTool()
    const [updateTool, { isLoading: isUpdating }] = useUpdateTool()
    const [deleteTool, { isLoading: isDeleting }] = useDeleteTool()

    const isLoading = isCreating || isUpdating || isDeleting || isToolLoading

    // Initialize form
    useEffect(() => {
        if (isEdit && tool) {
            dispatch(toolsPageActions.updateToolEditForm(tool))
        } else if (!isEdit) {
            dispatch(toolsPageActions.resetToolCreateForm())
            dispatch(toolsPageActions.updateToolCreateType('function'))

            if (!isAdmin && authData) {
                dispatch(toolsPageActions.updateToolsCreateForm({
                    user: { id: authData.id, name: authData.username || authData.name || '' },
                    userId: authData.id,
                    type: 'function'
                } as any))
            }
        }
    }, [dispatch, isEdit, tool, isAdmin, authData])

    const onChangeField = useCallback((field: keyof Tool, value: any) => {
        if (isEdit) {
            dispatch(toolsPageActions.updateToolEditForm({ ...formFields, [field]: value }))
        } else {
            dispatch(toolsPageActions.updateToolsCreateForm({ ...formFields, [field]: value }))
        }
    }, [dispatch, isEdit, formFields])

    const onChangeClient = useCallback((id: string) => {
        const user = { id, name: '' }
        if (isEdit) {
            dispatch(toolsPageActions.updateToolEditForm({ ...formFields, user, userId: id }))
        } else {
            dispatch(toolsPageActions.updateToolsCreateForm({ ...formFields, user, userId: id }))
        }
    }, [dispatch, isEdit, formFields])

    const onChangeType = useCallback((type: string) => {
        if (isEdit) {
            dispatch(toolsPageActions.updateToolEditType(type as any))
        } else {
            dispatch(toolsPageActions.updateToolCreateType(type as any))
        }
    }, [dispatch, isEdit])

    const onSave = useCallback(async () => {
        if (!formFields?.name || !formFields?.type) {
            toast.error(t('Пожалуйста заполни все поля'))
            return
        }

        try {
            if (isEdit && toolId) {
                await updateTool(formFields).unwrap()
                toast.success(t('Функция успешно обновлена'))
            } else {
                await createTool([formFields]).unwrap()
                toast.success(t('Функция успешно создана'))
            }
            navigate(getRouteTools())
        } catch (e) {
            // Error toast handled by global toastMiddleware
        }
    }, [formFields, isEdit, toolId, updateTool, createTool, navigate, t])

    const onDelete = useCallback(async () => {
        if (!toolId) return
        if (!window.confirm(t('Вы уверены, что хотите удалить функцию?') || '')) return

        try {
            await deleteTool(toolId).unwrap()
            toast.success(t('Функция успешно удалена'))
            navigate(getRouteTools())
        } catch (e) {
            // Error toast handled by global toastMiddleware
        }
    }, [deleteTool, toolId, navigate, t])

    const onClose = useCallback(() => {
        navigate(getRouteTools())
    }, [navigate])

    if (isToolLoading) {
        return (
            <VStack max align="center" justify="center" className={cls.loader}>
                <Loader />
            </VStack>
        )
    }

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
            <VStack gap="16" max className={classNames(cls.ToolForm, {}, [className])}>
                <ToolFormHeader
                    onSave={onSave}
                    onClose={onClose}
                    onDelete={onDelete}
                    isEdit={isEdit}
                    isLoading={isLoading}
                    toolName={formFields?.name}
                />

                <HStack
                    gap={isMobile ? '16' : '24'}
                    max
                    align="start"
                    wrap="wrap"
                    className={cls.contentWrapper}
                >
                    <VStack gap="24" max className={cls.leftColumn}>
                        <GeneralToolCard
                            formFields={formFields}
                            isAdmin={isAdmin}
                            onChangeField={onChangeField}
                            onChangeClient={onChangeClient}
                            onChangeType={onChangeType}
                        />
                    </VStack>

                    <VStack gap="24" max className={cls.rightColumn}>
                        <FunctionToolCard
                            formFields={formFields}
                            onChangeField={onChangeField}
                            isEdit={isEdit}
                        />
                    </VStack>
                </HStack>

                <ToolFormHeader
                    onSave={onSave}
                    onClose={onClose}
                    isEdit={isEdit}
                    isLoading={isLoading}
                    variant={'diviner-bottom'}
                    toolName={formFields?.name}
                />
            </VStack>
        </DynamicModuleLoader>
    )
})
