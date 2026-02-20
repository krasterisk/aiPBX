import React, { ChangeEvent, memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Check } from '@/shared/ui/mui/Check'
import { ToolParam } from '@/entities/Tools'
import { classNames } from '@/shared/lib/classNames/classNames'
import { FileCode } from 'lucide-react'
import cls from './ToolAddParameterModal.module.scss'

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
    onSave,
    className
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
    if (!parName) return

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

  const toggleEnumHandler = useCallback((e: any) => {
    setEnumShow(e.target.checked)
  }, [])

  const toggleRequiredHandler = useCallback((e: any) => {
    setRequired(e.target.checked)
  }, [])

  const changeEnumsHandler = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setEnumValue(value)
    const lines = value.split('\n').map(line => line.trim()).filter(Boolean)
    setEnums(lines)
  }, [])

  return (
    <Modal isOpen={show} onClose={onClose} lazy className={classNames(cls.modal, {}, [className])}>
      <VStack gap={'24'} max className={cls.content}>
        <HStack gap="16" align="center" max>
          <div className={cls.iconWrapper}>
            <FileCode size={20} />
          </div>
          <VStack gap="4">
            <Text title={t('Параметр')} size="l" bold />
            {label && <Text text={label} size="s" variant="accent" />}
          </VStack>
        </HStack>

        <VStack gap="16" max>
          <VStack gap="8" max>
            <Text text={t('Название параметра')} size="s" bold className={cls.label} />
            <Textarea
              placeholder={t('Название параметра') ?? ''}
              onChange={changeNameHandler}
              value={parName}
              className={cls.fullWidth}
            />
          </VStack>

          <VStack gap="8" max>
            <Text text={t('Описание параметра')} size="s" bold className={cls.label} />
            <Textarea
              placeholder={t('Описание параметра') ?? ''}
              onChange={changeDescriptionHandler}
              value={description}
              multiline
              minRows={3}
              className={cls.fullWidth}
            />
          </VStack>

          <HStack gap="24" max className={cls.checks}>
            <Check
              label={t('Указать возможные значения') || ''}
              onChange={toggleEnumHandler}
              checked={enumShow}
            />
            <Check
              label={t('Параметр обязателен') || ''}
              checked={required}
              onChange={toggleRequiredHandler}
            />
          </HStack>

          {enumShow &&
            <VStack gap="8" max>
              <Text text={t('Возможные значения')} size="s" bold className={cls.label} />
              <Textarea
                placeholder={t('Каждое значение - отдельная строка') ?? ''}
                onChange={changeEnumsHandler}
                value={enumValue}
                multiline
                minRows={3}
                className={cls.fullWidth}
              />
            </VStack>
          }
        </VStack>

        <HStack gap={'12'} align={'center'} justify={'end'} max className={cls.footer}>
          <Button onClick={handleOnClose} variant={'clear'}>
            {t('Закрыть')}
          </Button>
          <Button onClick={handleOnSave} variant={'outline'}>
            {t('Сохранить')}
          </Button>
        </HStack>
      </VStack>
    </Modal>
  )
})

export default ToolAddParameterModal
