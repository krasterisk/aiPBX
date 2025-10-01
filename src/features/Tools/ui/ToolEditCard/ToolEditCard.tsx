import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolEditCard.module.scss'
import React, { ChangeEvent, memo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { getToolsEditForm, Tool, toolsPageActions, useTool } from '@/entities/Tools'
import { ToolEditCardHeader } from '../ToolEditCardHeader/ToolEditCardHeader'
import { useSelector } from 'react-redux'
import { ClientOptions, ClientSelect, getUserAuthData, isUserAdmin } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Check } from '@/shared/ui/mui/Check'
import { ToolAddParam } from '../ToolAddParam/ToolAddParam'

interface UserEditCardProps {
  className?: string
  onEdit?: (data: Tool) => void
  toolId?: string
  onDelete?: (id: string) => void
}

export const ToolEditCard = memo((props: UserEditCardProps) => {
  const {
    className,
    onEdit,
    toolId,
    onDelete
  } = props

  const { t } = useTranslation('tools')

  const { data: tool, isError, isLoading } = useTool(toolId!, {
    skip: !toolId
  })

  const dispatch = useAppDispatch()
  const clientData = useSelector(getUserAuthData)
  const isAdmin = useSelector(isUserAdmin)
  const formFields = useSelector(getToolsEditForm)

  useEffect(() => {
    if (tool) {
      dispatch(toolsPageActions.updateToolEditForm(tool))
    }
  }, [dispatch, tool])

  const onChangeClientHandler = useCallback((
    event: any,
    newValue: ClientOptions | null) => {
    if (newValue) {
      dispatch(toolsPageActions.setUser(newValue))
    } else {
      dispatch(toolsPageActions.setUser({ id: '', name: '' }))
    }
  }, [dispatch])

  const editTextChangeHandler = (field: keyof Tool) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value

      const updatedForm = {
        ...formFields,
        [field]: value
      }
      dispatch(toolsPageActions.updateToolEditForm(updatedForm))
    }

  const toggleStrictHandler = useCallback(() => {
    const updatedForm = {
      ...formFields,
      strict: !formFields?.strict
    }
    dispatch(toolsPageActions.updateToolEditForm(updatedForm))
  }, [dispatch, formFields])

  const IsAdminOptions = (
      <>
        <ClientSelect
            value={tool?.user as ClientOptions}
            onChangeClient={onChangeClientHandler}
            label={String(t('Клиент'))}
            className={cls.client}
            data-testid={'ToolEditCard.ClientSelect'}
        />
      </>
  )

  const editHandler = useCallback(() => {
    if (formFields) {
      onEdit?.(formFields)
    }
  }, [formFields, onEdit])

  if (isError) {
    return (
        <ErrorGetData/>
    )
  }

  if (isLoading) {
    return (
        <VStack gap={'16'} max>
          <Card max>
            <Skeleton width='100%' border='8px' height='44px'/>
          </Card>
          <Skeleton width='100%' border='8px' height='80px'/>
          <Skeleton width='100%' border='8px' height='80px'/>
          <Skeleton width='100%' border='8px' height='80px'/>
        </VStack>
    )
  }

  return (
      <VStack
          gap={'8'}
          max
          className={classNames(cls.ToolCreateCard, {}, [className])}
      >
        <ToolEditCardHeader onEdit={editHandler} onDelete={onDelete}/>
        <Card
            max
            padding={'16'}
            border={'partial'}
        >
          <VStack gap={'16'} max>
            {!isAdmin ? <Text title={clientData?.name}/> : IsAdminOptions}

            <Textarea
                label={t('Наименование функции') ?? ''}
                onChange={editTextChangeHandler('name')}
                data-testid={'ToolCardCreate.name'}
                value={formFields?.name || ''}
            />
            <Textarea
                label={t('Описание функции') ?? ''}
                onChange={editTextChangeHandler('description')}
                data-testid={'ToolCardCreate.description'}
                value={formFields?.description || ''}
                minRows={3}
                multiline
            />
            <Check
                label={t('Строгий режим вызова функции') || ''}
                onChange={toggleStrictHandler}
                checked={formFields?.strict || false}
            />
            <ToolAddParam
                isEdit
                toolName={formFields?.name}
            />
            <Textarea
                label={t('Адрес вебхука') ?? ''}
                onChange={editTextChangeHandler('webhook')}
                data-testid={'ToolCardCreate.webhook'}
                value={formFields?.webhook || ''}
            />
            <Textarea
                label={t('Комментарий') ?? ''}
                onChange={editTextChangeHandler('comment')}
                data-testid={'ToolCardCreate.comment'}
                value={formFields?.comment || ''}
            />
          </VStack>
        </Card>
        <ToolEditCardHeader onEdit={editHandler} variant={'diviner-bottom'}/>
      </VStack>
  )
})
