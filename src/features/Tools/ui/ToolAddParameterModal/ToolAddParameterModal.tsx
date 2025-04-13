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
  onSave?: (name: string, param: ToolParam, required: boolean) => void
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
  const [description, setDescription] = useState<string>(param?.description || '')
  const [required, setRequired] = useState<boolean>(false)

  useEffect(() => {
    if (!paramName) {
      setParName('')
      setDescription('')
      setRequired(false)
    }

    if (param?.description && paramName) {
      setParName(paramName)
      setDescription(param?.description)
      // setRequired(param?.required)
      setRequired(false)
    }
  }, [param, paramName])

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

    const param: ToolParam = {
      type: 'string',
      description
    }

    onSave?.(parName, param, required)
    onClose?.()
  }, [description, onClose, onSave, parName, required])

  const handleOnClose = useCallback(() => {
    onClose?.()
  }, [onClose])

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
            <Check label={t('Параметр обязателен') || ''} />
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
