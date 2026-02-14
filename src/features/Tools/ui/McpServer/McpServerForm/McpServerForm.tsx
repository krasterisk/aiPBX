import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useMediaQuery } from '@mui/material'
import { classNames } from '@/shared/lib/classNames/classNames'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Loader } from '@/shared/ui/Loader'
import {
    CreateMcpServerDto,
    useMcpServersAll,
    useCreateMcpServer,
    useUpdateMcpServer,
    useDeleteMcpServer
} from '@/entities/Mcp'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { getRouteMcpServers } from '@/shared/const/router'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'
import { McpServerFormHeader } from './components/McpServerFormHeader/McpServerFormHeader'
import { GeneralMcpServerCard } from './components/GeneralMcpServerCard/GeneralMcpServerCard'
import { ConnectionMcpServerCard } from './components/ConnectionMcpServerCard/ConnectionMcpServerCard'
import { McpToolsCard } from './components/McpToolsCard/McpToolsCard'
import cls from './McpServerForm.module.scss'

interface HeaderEntry {
    key: string
    value: string
}

interface McpServerFormProps {
    className?: string
    serverId?: string
    isEdit?: boolean
}

type AuthType = 'none' | 'bearer' | 'apikey' | 'custom_headers'
type TransportType = 'websocket' | 'http'

export const McpServerForm = memo((props: McpServerFormProps) => {
    const { className, serverId, isEdit } = props
    const { t } = useTranslation('tools')
    const navigate = useNavigate()
    const isMobile = useMediaQuery('(max-width:1000px)')

    const isAdmin = useSelector(isUserAdmin)
    const authData = useSelector(getUserAuthData)

    const { data: servers, isLoading: isServersLoading } = useMcpServersAll(null, { skip: !isEdit || !serverId })
    const server = useMemo(
        () => servers?.find(s => s.id === Number(serverId)) ?? null,
        [servers, serverId]
    )

    const [createMcpServer, { isLoading: isCreating }] = useCreateMcpServer()
    const [updateMcpServer, { isLoading: isUpdating }] = useUpdateMcpServer()
    const [deleteMcpServer, { isLoading: isDeleting }] = useDeleteMcpServer()
    const isSaving = isCreating || isUpdating || isDeleting

    // Form state
    const [name, setName] = useState('')
    const [url, setUrl] = useState('')
    const [transport, setTransport] = useState<TransportType>('http')
    const [authType, setAuthType] = useState<AuthType>('none')
    const [userId, setUserId] = useState<string>(authData?.id || '')
    const [bearerToken, setBearerToken] = useState('')
    const [apiKey, setApiKey] = useState('')
    const [customHeaders, setCustomHeaders] = useState<HeaderEntry[]>([{ key: '', value: '' }])

    // Initialize form from server data when editing
    useEffect(() => {
        if (isEdit && server) {
            setName(server.name || '')
            setUrl(server.url || '')
            setTransport(server.transport || 'http')
            setAuthType(server.authType || 'none')
            setUserId(server.userId ? String(server.userId) : '')
            setBearerToken(server.authCredentials?.token || '')
            setApiKey(server.authCredentials?.apiKey || '')
            if (server.authType === 'custom_headers' && server.authCredentials) {
                setCustomHeaders(
                    Object.entries(server.authCredentials).map(([key, value]) => ({ key, value }))
                )
            }
        }
    }, [isEdit, server])

    // Custom headers handlers
    const onAddHeader = useCallback(() => {
        setCustomHeaders(prev => [...prev, { key: '', value: '' }])
    }, [])

    const onRemoveHeader = useCallback((index: number) => {
        setCustomHeaders(prev => {
            const updated = prev.filter((_, i) => i !== index)
            return updated.length > 0 ? updated : [{ key: '', value: '' }]
        })
    }, [])

    const onHeaderChange = useCallback((index: number, field: 'key' | 'value', val: string) => {
        setCustomHeaders(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: val }
            return updated
        })
    }, [])

    // Build credentials
    const buildCredentials = useCallback((): Record<string, string> | undefined => {
        switch (authType) {
            case 'none':
                return undefined
            case 'bearer':
                return bearerToken ? { token: bearerToken } : undefined
            case 'apikey':
                return apiKey ? { apiKey } : undefined
            case 'custom_headers': {
                const result: Record<string, string> = {}
                for (const entry of customHeaders) {
                    const key = entry.key.trim()
                    if (key) result[key] = entry.value
                }
                return Object.keys(result).length > 0 ? result : undefined
            }
            default:
                return undefined
        }
    }, [authType, bearerToken, apiKey, customHeaders])

    // Save handler
    const onSave = useCallback(async () => {
        if (!name.trim() || !url.trim()) {
            toast.error(t('Пожалуйста заполни все поля'))
            return
        }

        const dto: CreateMcpServerDto = {
            name: name.trim(),
            url: url.trim(),
            transport,
            authType,
            authCredentials: buildCredentials(),
        }

        try {
            if (isEdit && server) {
                await updateMcpServer({ id: server.id, ...dto }).unwrap()
                toast.success(t('MCP сервер обновлён'))
            } else {
                await createMcpServer(dto).unwrap()
                toast.success(t('MCP сервер создан'))
            }
            navigate(getRouteMcpServers())
        } catch (e) {
            toast.error(getErrorMessage(e))
        }
    }, [name, url, transport, authType, buildCredentials, isEdit, server, updateMcpServer, createMcpServer, navigate, t])

    const onDelete = useCallback(async () => {
        if (!server) return
        if (!window.confirm(t('Вы уверены, что хотите удалить MCP сервер?') || '')) return

        try {
            await deleteMcpServer(server.id).unwrap()
            toast.success(t('MCP сервер удалён'))
            navigate(getRouteMcpServers())
        } catch (e) {
            toast.error(getErrorMessage(e))
        }
    }, [deleteMcpServer, server, navigate, t])

    const onClose = useCallback(() => {
        navigate(getRouteMcpServers())
    }, [navigate])

    if (isServersLoading) {
        return (
            <VStack max align="center" justify="center" className={cls.loader}>
                <Loader />
            </VStack>
        )
    }

    return (
        <VStack gap="16" max className={classNames(cls.McpServerForm, {}, [className])}>
            <McpServerFormHeader
                onSave={onSave}
                onClose={onClose}
                onDelete={onDelete}
                isEdit={isEdit}
                isLoading={isSaving}
                serverName={name}
            />

            <HStack
                gap={isMobile ? '16' : '24'}
                max
                align="start"
                wrap="wrap"
                className={cls.contentWrapper}
            >
                {/* Left Column — General + Auth (single card) */}
                <VStack gap="24" max className={cls.leftColumn}>
                    <GeneralMcpServerCard
                        name={name}
                        url={url}
                        transport={transport}
                        userId={userId}
                        isAdmin={isAdmin}
                        onChangeName={setName}
                        onChangeUrl={setUrl}
                        onChangeTransport={(v) => setTransport(v as TransportType)}
                        onChangeClient={setUserId}
                        authType={authType}
                        bearerToken={bearerToken}
                        apiKey={apiKey}
                        customHeaders={customHeaders}
                        onChangeAuthType={setAuthType}
                        onChangeBearerToken={setBearerToken}
                        onChangeApiKey={setApiKey}
                        onAddHeader={onAddHeader}
                        onRemoveHeader={onRemoveHeader}
                        onHeaderChange={onHeaderChange}
                    />
                </VStack>

                {/* Right Column — Connection + Tools (edit mode only) */}
                {isEdit && server && (
                    <VStack gap="24" max className={cls.rightColumn}>
                        <ConnectionMcpServerCard server={server} />
                        <McpToolsCard
                            serverId={server.id}
                            serverStatus={server.status}
                        />
                    </VStack>
                )}
            </HStack>

            <McpServerFormHeader
                onSave={onSave}
                onClose={onClose}
                isEdit={isEdit}
                isLoading={isSaving}
                variant={'diviner-bottom'}
                serverName={name}
            />
        </VStack>
    )
})
