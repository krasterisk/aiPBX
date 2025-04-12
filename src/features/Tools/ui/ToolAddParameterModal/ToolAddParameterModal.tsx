import React, { ChangeEvent, memo, useCallback, useState } from 'react'
import { Tool } from '@/entities/Tools'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Tooltip } from '@mui/material'

export interface ToolAddParameterModalProps {
  className?: string
  tool: Tool
  show: boolean
  label?: string
  onClose?: () => void
}

interface Parameter {
  name: string
  description: string
  parameters: {
    type: string
    properties: object[]
  }
}

const ToolAddParameterModal = memo((props: ToolAddParameterModalProps) => {
  const {
    tool,
    show,
    label,
    onClose
  } = props

  const { t } = useTranslation('tools')

  const initParam: Parameter = {
    name: '',
    description: '',
    parameters: {
      type: 'object',
      properties: []
    }
  }

  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [require, setRequier] = useState<boolean>(false)
  const [param, setParam] = useState<Parameter>(initParam)

  const changeNameHandler = useCallback((
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setName(value)
  }, [])

  const changedescriptionHandler = useCallback((
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setDescription(value)
  }, [])

  const handleOnSave = useCallback(() => {
    onClose?.()
  }, [onClose])

  const handleOnClose = useCallback(() => {
    onClose?.()
  }, [onClose])

  return (
      <Modal isOpen={show} onClose={onClose} lazy>
        <VStack gap={'24'} max>
          <VStack max justify={'center'} align={'center'}>
            <Text title={tool.name} bold/>
            <Text text={String(label) + ':'} bold/>
          </VStack>
          <HStack max wrap={'wrap'} gap={'16'}>
            <Tooltip title={t('Идентификатор функции, используйте только латинские символы, подчёркивания вместо пробелов. Название функции должно отражать её суть, например get_price, get_client_name и т.д')}>
              <Text text={t('Наименование функции')} bold/>
            </Tooltip>
            <Textarea
                label={t('Название параметра') ?? ''}
                onChange={changeNameHandler}
                value={name}
            />
            <Tooltip title={t('Описание функции, опишите назначение функции, её роль и другие нюансы')}>
              <Text text={t('Описание функции')} bold/>
            </Tooltip>
            <Textarea
                label={t('Описание функции') ?? ''}
                onChange={changeNameHandler}
                value={description}
            />

          </HStack>
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
