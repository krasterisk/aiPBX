import React, { ChangeEvent, memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Check } from '@/shared/ui/mui/Check'
import { ToolParam } from '@/entities/Tools'

export interface ToolAddParameterModalProps {
  className?: string
  param?: ToolParam
  paramName?: string
  show: boolean
  label?: string
  onClose?: () => void
  onSave?: (
    name: string,
    param: ToolParam,
    required: boolean,
    prevName?: string
  ) => void
}

const ToolAddParameterModal = memo((props: ToolAddParameterModalProps) => {
  const {
    label,
    show,
    param,
    paramName,
    onClose,
    onSave
  } = props

  const { t } = useTranslation('tools')

  const [parName, setParName] = useState<string>(paramName || '')
  const [prevName, setPrevName] = useState<string>(paramName || '')
  const [description, setDescription] = useState<string>(param?.description || '')
  const [required, setRequired] = useState<boolean>(false)
  const [enumShow, setEnumShow] = useState<boolean>(false)
  const [enums, setEnums] = useState<string[]>([])
  const [enumValue, setEnumValue] = useState<string>('')

  useEffect(() => {
    if (paramName || param) {
      setParName(paramName || '')
      setPrevName(paramName || '')
      setDescription(param?.description || '')
      setRequired(param?.required || false)
      const enumList = param?.enum || []
      setEnumValue(enumList.join('\n'))
      setEnums(enumList)
      setEnumShow(enumList.length > 0)
    }
    if (show && !param && !paramName) {
      setParName('')
      setDescription('')
      setEnumValue('')
      setEnums([])
      setEnumShow(false)
      setRequired(false)
    }
  }, [param, paramName, show])

  const changeNameHandler = useCallback((
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setParName(value)
  }, [])

  const changeDescriptionHandler = useCallback((
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setDescription(value)
  }, [])

  const handleOnSave = useCallback(() => {
    if (!parName && !description) return

    const params: ToolParam = {
      type: 'string',
      description
    }

    if (enumShow && enums.length > 0) {
      params.enum = enums
    }
    onSave?.(parName, params, required, prevName)
  }, [description, enumShow, enums, onSave, parName, prevName, required])

  const handleOnClose = useCallback(() => {
    onClose?.()
  }, [onClose])

  const toggleEnumHandler = useCallback(() => {
    setEnumShow(prev => !prev)
  }, [])

  const toggleRequiredHandler = useCallback(() => {
    setRequired(prev => !prev)
  }, [])

  const changeEnumsHandler = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setEnumValue(value)
    const lines = value.split('\n').map(line => line.trim()).filter(Boolean)
    setEnums(lines)
  }, [])

  return (
      <Modal isOpen={show} onClose={onClose} lazy>
        <VStack gap={'24'} max>
          <VStack max justify={'center'} align={'center'}>
            <Text title={label} bold/>
          </VStack>
            <Textarea
                label={t('Название параметра') ?? ''}
                onChange={changeNameHandler}
                value={parName}
            />
            <Textarea
                label={t('Описание параметра') ?? ''}
                onChange={changeDescriptionHandler}
                value={description}
                multiline
                minRows={3}
            />
          <Check
              label={t('Указать возможные значения') || ''}
              onChange={toggleEnumHandler}
              checked={enumShow}
          />
          {enumShow &&
              <Textarea
                  label={t('Каждое значение - отдельная строка') ?? ''}
                  onChange={changeEnumsHandler}
                  value={enumValue}
                  multiline
                  minRows={3}
              />
          }
          <Check
              label={t('Параметр обязателен') || ''}
              checked={required}
              onChange={toggleRequiredHandler}
          />
          <HStack gap={'16'} align={'center'} justify={'end'} max>
            <Button onClick={handleOnClose} variant={'outline'} color={'normal'}>
              {t('Закрыть')}
            </Button>
            <Button onClick={handleOnSave} variant={'outline'} color={'success'}>
              {t('Сохранить')}
            </Button>
          </HStack>
        </VStack>
      </Modal>
  )
})

export default ToolAddParameterModal
