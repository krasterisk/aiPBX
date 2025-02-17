import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './EndpointCreateCard.module.scss'
import { useTranslation } from 'react-i18next'
import { memo, useCallback, useState } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Input } from '@/shared/ui/redesigned/Input'
import { CodecSelect } from '../../../../CodecSelect'
import { EndpointCreateHeader } from '../EndpointCreateHeader/EndpointCreateHeader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { ContextSelect } from '../../Contexts/ContextSelect/ContextSelect'
import { useSelector } from 'react-redux'
import { getUserAuthData } from '@/entities/User'
import { Endpoint } from '@/entities/Pbx'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { TabPanelItem, TabsPanel } from '@/shared/ui/redesigned/TabsPanel'

interface EndpointCreateCardProps {
  className?: string
  onCreate?: (data: Endpoint) => void
  isError?: boolean
  error?: FetchBaseQueryError | SerializedError | undefined
}

export const EndpointCreateCard = memo((props: EndpointCreateCardProps) => {
  const {
    className,
    onCreate,
    isError,
    error
  } = props

  const userData = useSelector(getUserAuthData)
  const vpbx_user_id = userData?.vpbx_user_id || '0'

  const initEndpoint = {
    id: 'LIST',
    endpoint_id: '',
    allow: '',
    auth_type: 'userpass',
    context: '',
    max_contacts: 0,
    password: '',
    transport: 'udp',
    username: '',
    vpbx_user_id
  }

  const [formFields, setFormFields] = useState<Endpoint>(initEndpoint)

  const { t } = useTranslation('endpoints')

  const createChangeHandler = (field: keyof Endpoint) => (value: string) => {
    setFormFields({
      ...formFields,
      [field]: value
    })
  }

  const createHandler = useCallback(() => {
    onCreate?.(formFields)
  }, [formFields, onCreate])

  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const tabItems: TabPanelItem[] = [
    {
      label: t('Основные настройки'),
      content: (
                        <VStack gap={'16'}>
                            <Input
                                label={t('Номер') ?? ''}
                                onChange={createChangeHandler('endpoint_id')}
                                data-testid={'EndpointCard.endpoint_id'}
                                value={formFields.endpoint_id}
                            />
                            <Input
                                label={t('Имя пользователя') ?? ''}
                                onChange={createChangeHandler('username')}
                                data-testid={'EndpointCard.Username'}
                                value={formFields.username}
                            />
                            <ContextSelect
                                data-testid={'EndpointCard.Context'}
                                onChange={createChangeHandler('context')}
                                value={formFields.context}
                            />
                        </VStack>
      )
    },
    {
      label: t('Расширенные настройки'),
      content: (
                <VStack gap={'16'}>
                    <Input
                        label={t('Транспортный протокол') ?? ''}
                        onChange={createChangeHandler('transport')}
                        data-testid={'EndpointCard.Transport'}
                        value={formFields.transport}
                    />
                    <Input
                        label={t('Авторизация') ?? ''}
                        onChange={createChangeHandler('auth_type')}
                        data-testid={'EndpointCard.AuthType'}
                        value={formFields.auth_type}
                    />
                    <CodecSelect
                        data-testid={'EndpointCard.CodecSelect'}
                        onChange={createChangeHandler('allow')}
                        value={formFields.allow}
                        defaultValue={String(t('Выбрать...'))}
                    />
                    <Input
                        label={t('Количество одновременных звонков') ?? ''}
                        onChange={createChangeHandler('max_contacts')}
                        data-testid={'EndpointCard.MaxContacts'}
                        value={formFields.max_contacts}
                    />
                </VStack>
      )
    },
    {
      label: t('Автонастройка аппаратов'),
      content: (
                <VStack gap={'16'}>
                    <Input
                        label={t('MAC адрес') ?? ''}
                        onChange={createChangeHandler('max_contacts')}
                        data-testid={'EndpointCard.Mac'}
                        value={formFields.max_contacts}
                    />
                    <Input
                        label={t('Префикс') ?? ''}
                        onChange={createChangeHandler('auth_type')}
                        data-testid={'EndpointCard.AuthType'}
                        value={formFields.auth_type}
                    />
                </VStack>
      )
    }
  ]

  return (
        <VStack gap={'8'} max className={classNames(cls.EndpointCreateCard, {}, [className])}>
            <EndpointCreateHeader onCreate={createHandler}/>
            { isError
              ? <ErrorGetData
                    title={t('Ошибка при создании абонента') || ''}
                    text={
                        error && 'data' in error
                          ? String(t((error.data as { message: string }).message))
                          : String(t('Проверьте заполняемые поля и повторите ещё раз'))
                    }
                />
              : ''}
            <Card max padding={'8'} border={'partial'}>
                <TabsPanel
                    className={cls.tab}
                    tabItems={tabItems}
                    value={activeTab}
                    onChange={handleTabChange}
                />
            </Card>
        </VStack>
  )
})
