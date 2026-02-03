import React, { memo, useCallback, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Card } from '@/shared/ui/redesigned/Card'
import { Button } from '@/shared/ui/redesigned/Button'
import { Trash2, Plus } from 'lucide-react'
import {
  getToolsCreateParameters,
  getToolsEditParameters,
  ToolParam,
  ToolParameters,
  toolsPageActions
} from '@/entities/Tools'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import ToolAddParameterModal from '../ToolAddParameterModal/ToolAddParameterModal'
import { useSelector } from 'react-redux'
import { SnackAlert } from '@/shared/ui/mui/SnackAlert'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolAddParam.module.scss'

interface ToolAddParamProps {
  parameters?: ToolParameters
  className?: string
  toolName?: string
  isEdit?: boolean
}

export const ToolAddParam = memo((props: ToolAddParamProps) => {
  const {
    className,
    toolName,
    isEdit
  } = props

  const { t } = useTranslation('tools')
  const dispatch = useAppDispatch()
  const [isAddParameterOpen, setIsAddParameterOpen] = useState<boolean>(false)
  const [param, setParam] = useState<ToolParam | undefined>(undefined)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [paramName, setParamName] = useState<string>('')

  const editParameters = useSelector(getToolsEditParameters)
  const createParameters = useSelector(getToolsCreateParameters)
  const parameters = isEdit ? editParameters : createParameters

  const onAddParamClick = useCallback(() => {
    setParamName('')
    setParam(undefined)
    setIsAddParameterOpen(true)
  }, [])

  const onCloseModalHandler = useCallback(() => {
    setIsAddParameterOpen(false)
  }, [])

  const onSaveHandler = useCallback((
    name: string,
    param: ToolParam,
    required: boolean,
    prevName?: string
  ) => {
    const existingProps = parameters?.properties ?? {}
    const existingRequired = parameters?.required ?? []

    const isNameChanged = name !== prevName
    const isDuplicate = !!existingProps[name]

    if (isNameChanged && isDuplicate) {
      setErrorMessage(String(t('Параметр с именем уже существует')))
      setErrorOpen(true)
      return
    }
    const updatedProperties = { ...existingProps }
    if (isNameChanged && prevName && updatedProperties[prevName]) {
      delete updatedProperties[prevName]
    }

    updatedProperties[name] = param

    const updatedRequired = required
      ? Array.from(new Set([...existingRequired, name]))
      : existingRequired.filter(name => name !== prevName)

    const updatedTool: ToolParameters = {
      type: 'object',
      properties: updatedProperties,
      required: updatedRequired
    }

    if (isEdit) {
      dispatch(toolsPageActions.updateToolEditParameters(updatedTool))
    } else {
      dispatch(toolsPageActions.updateToolCreateParameters(updatedTool))
    }
    setErrorMessage('')
    setErrorOpen(false)
    onCloseModalHandler()
  }, [parameters?.properties, parameters?.required, isEdit, onCloseModalHandler, t, dispatch])

  const onEditParamClick = useCallback((name: string, param: ToolParam, isRequired: boolean) => {
    const editableParam: ToolParam = {
      ...param,
      ...(isRequired ? { required: true } : {})
    }
    setParam(editableParam)
    setParamName(name)
    setIsAddParameterOpen(true)
  }, [])

  const onDeleteParamClick = useCallback((name: string) => {
    const updatedProperties = { ...parameters?.properties }
    delete updatedProperties[name]

    const updatedRequired = parameters?.required?.filter(r => r !== name) || []

    const updatedTool: ToolParameters = {
      type: 'object',
      properties: updatedProperties,
      required: updatedRequired
    }

    if (isEdit) {
      dispatch(toolsPageActions.updateToolEditParameters(updatedTool))
    } else {
      dispatch(toolsPageActions.updateToolCreateParameters(updatedTool))
    }
  }, [dispatch, isEdit, parameters?.properties, parameters?.required])

  const requiredList = parameters?.required || []

  return (
    <VStack gap={'12'} max className={classNames(cls.ToolAddParam, {}, [className])}>
      <SnackAlert
        message={errorMessage}
        variant={'filled'}
        severity={'error'}
        onClose={() => {
          setErrorOpen(false)
        }}
        open={errorOpen}
      />
      <ToolAddParameterModal
        param={param}
        paramName={paramName}
        label={toolName}
        show={isAddParameterOpen}
        onClose={onCloseModalHandler}
        onSave={onSaveHandler}
      />

      <Text text={t('Параметры функции')} bold size="s" variant="accent" />

      <HStack gap="8" max wrap={'wrap'}>
        {parameters?.properties && Object.entries(parameters.properties).map(([key, param]) => {
          const isRequired = requiredList.includes(key)
          return (
            <Card
              key={key}
              padding="8"
              border="partial"
              variant="outlined"
              className={cls.parameterCard}
            >
              <HStack gap="4" max align="center">
                <Button
                  onClick={() => {
                    onEditParamClick(key, param, isRequired)
                  }}
                  variant={'clear'}
                  className={cls.paramName}
                >
                  <Text text={key + (isRequired ? ' *' : '')} />
                </Button>
                <Button
                  addonLeft={<Trash2 size={16} />}
                  onClick={() => {
                    onDeleteParamClick(key)
                  }}
                  variant={'clear'}
                  className={cls.deleteBtn}
                />
              </HStack>
            </Card>
          )
        })}
      </HStack>

      <Button
        onClick={onAddParamClick}
        addonLeft={<Plus size={18} />}
        variant={'outline'}
        className={cls.addBtn}
      >
        {t('Добавить параметр')}
      </Button>
    </VStack>
  )
})
