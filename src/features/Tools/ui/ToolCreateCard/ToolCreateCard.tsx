import { useTranslation } from 'react-i18next'
import cls from './ToolCreateCard.module.scss'
import React, { ChangeEvent, memo, useCallback, useState } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { classNames } from '@/shared/lib/classNames/classNames'
import {
  Tool,
  toolsPageActions,
  getToolsUser,
  ToolParam
} from '@/entities/Tools'
import { useSelector } from 'react-redux'
import { ClientOptions, ClientSelect, getUserAuthData, isUserAdmin } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { ToolCreateCardHeader } from '../ToolCreateCardHeader/ToolCreateCardHeader'
import { Check } from '@/shared/ui/mui/Check'
import AddBoxIcon from '@mui/icons-material/AddBox'
import ToolAddParameterModal from '../ToolAddParameterModal/ToolAddParameterModal'
import { Button } from '@/shared/ui/redesigned/Button'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

interface ToolCreateCardProps {
  className?: string
  onCreate?: (data: Tool) => void
  isError?: boolean
  error?: FetchBaseQueryError | SerializedError | undefined
}

export const ToolCreateCard = memo((props: ToolCreateCardProps) => {
  const {
    className,
    onCreate,
    isError,
    error
  } = props

  const { t } = useTranslation('tools')

  const isAdmin = useSelector(isUserAdmin)
  const clientData = useSelector(getUserAuthData)
  const clientValues = useSelector(getToolsUser)
  const dispatch = useAppDispatch()

  const initTool: Tool = {
    id: '',
    name: '',
    type: 'function',
    description: '',
    strict: false,
    comment: '',
    userId: clientData?.id || '',
    user: {
      id: clientData?.id || '',
      username: clientData?.username || ''
    }
  }

  const [formFields, setFormFields] = useState<Tool>(initTool)
  const [isAddParameterOpen, setIsAddParameterOpen] = useState<boolean>(false)
  const [param, setParam] = useState<ToolParam>()
  const [paramName, setParamName] = useState<string>('')

  // useEffect(() => {
  //   if (!isAdmin && clientData?.id && clientData.username) {
  //     setFormFields({
  //       ...formFields,
  //       user: {
  //         id: clientData?.vpbx_user_id || clientData.id,
  //         name: clientData?.username
  //       },
  //       userId: clientData.id
  //     })
  //   }
  //   dispatch(toolsPageActions.updateToolsCreateForm(formFields))
  // }, [clientData, dispatch, formFields, isAdmin])

  const onAddParamClick = useCallback(() => {
    setParamName('')
    setIsAddParameterOpen(true)
  }, [])

  const onEditParamClick = useCallback((name: string, param: ToolParam) => {
    setParam(param)
    setParamName(name)
    setIsAddParameterOpen(true)
  }, [])

  const onDeleteParamClick = useCallback((name: string) => {
    const updatedProperties = { ...formFields.parameters?.properties }
    delete updatedProperties[name]

    const updatedRequired = formFields.parameters?.required?.filter(r => r !== name) || []

    const updatedTool: Tool = {
      ...formFields,
      parameters: {
        type: 'object',
        properties: updatedProperties,
        required: updatedRequired
      }
    }

    setFormFields(updatedTool)
    dispatch(toolsPageActions.updateToolsCreateForm(updatedTool))
  }, [dispatch, formFields])

  const onChangeClientHandler = useCallback((
    event: any,
    newValue: ClientOptions) => {
    dispatch(toolsPageActions.setUser(newValue))
    setFormFields({
      ...formFields,
      userId: newValue.id,
      user: newValue
    })
  }, [dispatch, formFields])

  const onSaveHandler = useCallback((
    name: string,
    param: ToolParam,
    required: boolean) => {
    const existingProps = formFields.parameters?.properties ?? {}
    const existingRequired = formFields.parameters?.required ?? []

    const updatedRequired = required
      ? Array.from(new Set([...existingRequired, name]))
      : existingRequired

    const updatedProperties = {
      ...existingProps,
      [name]: param
    }

    const updatedTool: Tool = {
      ...formFields,
      parameters: {
        type: 'object',
        properties: updatedProperties,
        required: updatedRequired
      }
    }

    setFormFields(updatedTool)

    dispatch(toolsPageActions.updateToolsCreateForm(updatedTool))
  }, [dispatch, formFields])

  const createTextChangeHandler = (field: keyof Tool) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value

      const updatedForm = {
        ...formFields,
        [field]: value
      }
      setFormFields(updatedForm)
      dispatch(toolsPageActions.updateToolsCreateForm(updatedForm))
    }

  const ParamsContent = () => {
    if (!formFields.parameters?.properties) return null

    return (
                <VStack gap={'8'}>
                    <Text text={t('Параметры функции')} bold/>
                    <HStack gap="8" max wrap={'wrap'}>
                        {Object.entries(formFields.parameters.properties).map(([key, param]) => (
                            <Card key={key} padding="8" border="partial" variant="light">
                                <HStack gap="4" max>
                                    <Button
                                        onClick={() => {
                                          onEditParamClick(key, param)
                                        }}
                                        variant={'clear'}
                                    >
                                        <Text text={key}/>
                                    </Button>
                                    <Button
                                        addonRight={<DeleteForeverIcon/>}
                                        onClick={() => {
                                          onDeleteParamClick(key)
                                        }}
                                        variant={'clear'}
                                    />
                                </HStack>
                            </Card>
                        ))}
                    </HStack>
                </VStack>
    )
  }

  const IsAdminOptions = (
            <>
                <ClientSelect
                    value={clientValues}
                    clientId={clientValues?.id}
                    onChangeClient={onChangeClientHandler}
                    label={String(t('Клиент'))}
                    className={cls.client}
                    data-testid={'ToolCreateCard.ClientSelect'}
                />
            </>
  )

  const createHandler = useCallback(() => {
    onCreate?.(formFields)
  }, [formFields, onCreate])

  return (
            <VStack
                gap={'8'}
                max
                className={classNames(cls.ToolCreateCard, {}, [className])}
            >
                <ToolCreateCardHeader onCreate={createHandler} variant={'diviner-top'}/>
                {isError
                  ? <ErrorGetData
                        title={t('Ошибка при создании функции') || ''}
                        text={
                            error && 'data' in error
                              ? String(t((error.data as { message: string }).message))
                              : String(t('Проверьте заполняемые поля и повторите ещё раз'))
                        }
                    />
                  : ''}
                <Card
                    max
                    padding={'16'}
                    border={'partial'}
                >
                    <VStack gap={'16'} max>
                        {!isAdmin ? <Text title={clientData?.name}/> : IsAdminOptions}
                        <ToolAddParameterModal
                            param={param}
                            paramName={paramName}
                            label={formFields.name}
                            show={isAddParameterOpen}
                            onClose={() => {
                              setIsAddParameterOpen(false)
                            }}
                            onSave={onSaveHandler}
                        />
                        <Textarea
                            label={t('Наименование функции') ?? ''}
                            onChange={createTextChangeHandler('name')}
                            data-testid={'ToolCardCreate.name'}
                            value={formFields.name}
                        />
                        <Textarea
                            label={t('Описание функции') ?? ''}
                            onChange={createTextChangeHandler('description')}
                            data-testid={'ToolCardCreate.description'}
                            value={formFields.description}
                            minRows={3}
                            multiline
                        />
                        <Check label={t('Строгий режим вызова функции') || ''}/>
                        {formFields.parameters?.properties && <ParamsContent/>}
                        <Button
                            title={String(t('Добавить параметр'))}
                            onClick={onAddParamClick}
                            addonLeft={
                                <AddBoxIcon className={cls.icon}/>
                            }
                            variant={'filled'}
                        >
                            <Text text={t('Добавить параметр')}/>
                        </Button>
                        <Textarea
                            label={t('Адрес вебхука') ?? ''}
                            onChange={createTextChangeHandler('webhook')}
                            data-testid={'ToolCardCreate.webhook'}
                            value={formFields.webhook}
                        />
                        <Textarea
                            label={t('Комментарий') ?? ''}
                            onChange={createTextChangeHandler('comment')}
                            data-testid={'ToolCardCreate.comment'}
                            value={formFields.comment}
                        />
                    </VStack>
                </Card>
                <ToolCreateCardHeader onCreate={createHandler} variant={'diviner-bottom'}/>
            </VStack>
  )
}
)
