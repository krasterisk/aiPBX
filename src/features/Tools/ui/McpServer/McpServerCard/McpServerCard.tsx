import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Trash2 } from 'lucide-react'
import {
    McpTool,
    useMcpServersAll,
    useDeleteMcpServer
} from '@/entities/Mcp'
import { McpServerForm } from '../McpServerForm/McpServerForm'
import { ConnectButton } from '../ConnectButton/ConnectButton'
import { SyncToolsButton } from '../SyncToolsButton/SyncToolsButton'
import { McpToolsList } from '../McpToolsList/McpToolsList'
import { McpToolDetails } from '../McpToolDetails/McpToolDetails'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './McpServerCard.module.scss'

interface McpServerCardProps {
    className?: string
}

export const McpServerCard = memo((props: McpServerCardProps) => {
    const { className } = props
    const { t } = useTranslation('tools')

    const { data: servers } = useMcpServersAll(null)
    const [deleteServer] = useDeleteMcpServer()

    const [selectedServerId, setSelectedServerId] = useState<number | null>(null)
    const [selectedTool, setSelectedTool] = useState<McpTool | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)

    // Derive selectedServer from RTK Query cache so status updates propagate automatically
    const selectedServer = useMemo(
        () => servers?.find(s => s.id === selectedServerId) ?? null,
        [servers, selectedServerId]
    )

    const onDeleteServer = useCallback(async (e: React.MouseEvent, serverId: number) => {
        e.stopPropagation()
        if (!window.confirm(t('Вы уверены, что хотите удалить MCP сервер?') || '')) return
        try {
            await deleteServer(serverId).unwrap()
            toast.success(t('MCP сервер удалён'))
            if (selectedServerId === serverId) {
                setSelectedServerId(null)
                setSelectedTool(null)
            }
        } catch (e) {
            // Error toast handled by global toastMiddleware
        }
    }, [deleteServer, selectedServerId, t])

    const onSelectTool = useCallback((tool: McpTool) => {
        setSelectedTool(prev => prev?.id === tool.id ? null : tool)
    }, [])

    return (
        <VStack gap="16" max className={classNames(cls.McpServerCard, {}, [className])}>
            {/* Existing servers list */}
            {servers && servers.length > 0 && (
                <VStack gap="8" max>
                    <Text text={t('Ваши MCP серверы') || ''} size="s" bold className={cls.label} />
                    {servers.map(server => (
                        <HStack
                            key={server.id}
                            max
                            gap="8"
                            align="center"
                            className={classNames(cls.existingServerRow, {
                                [cls.existingServerRowActive]: selectedServerId === server.id
                            })}
                            onClick={() => {
                                setSelectedServerId(prev =>
                                    prev === server.id ? null : server.id
                                )
                                setSelectedTool(null)
                                setShowAddForm(false)
                            }}
                        >
                            <VStack gap="4" max>
                                <Text text={server.name} size="s" className={cls.serverName} />
                                <Text text={server.url} size="s" className={cls.serverUrl} />
                            </VStack>
                            <button
                                type="button"
                                className={cls.deleteServerBtn}
                                onClick={async (e) => { await onDeleteServer(e, server.id) }}
                                title={t('Удалить') || 'Delete'}
                            >
                                <Trash2 size={14} />
                            </button>
                        </HStack>
                    ))}
                </VStack>
            )}

            {/* Selected server controls */}
            {selectedServer && !showAddForm && (
                <VStack gap="16" max className={cls.serverSection}>
                    <Text title={selectedServer.name} size="s" bold />

                    {/* Connection controls */}
                    <HStack gap="12" align="center" max className={cls.controlsRow}>
                        <ConnectButton server={selectedServer} />
                        <SyncToolsButton
                            serverId={selectedServer.id}
                            disabled={selectedServer.status !== 'active'}
                        />
                    </HStack>

                    <div className={cls.divider} />

                    {/* Tools list */}
                    <McpToolsList
                        serverId={selectedServer.id}
                        selectedToolId={selectedTool?.id}
                        onSelectTool={onSelectTool}
                        className={cls.toolsSection}
                    />

                    {/* Selected tool details */}
                    {selectedTool && (
                        <div className={cls.detailsSection}>
                            <McpToolDetails tool={selectedTool} />
                        </div>
                    )}

                    {/* Edit server */}
                    <Button
                        variant="outline"
                        size="s"
                        onClick={() => { setShowAddForm(true) }}
                    >
                        {t('Редактировать сервер')}
                    </Button>
                </VStack>
            )}

            {/* Add/Edit form */}
            {showAddForm && (
                <VStack gap="8" max className={cls.serverSection}>
                    <Text
                        text={selectedServer ? t('Редактировать сервер') : t('Добавить MCP сервер')}
                        size="s"
                        bold
                        className={cls.label}
                    />
                    <McpServerForm
                        serverId={selectedServer ? String(selectedServer.id) : undefined}
                        isEdit={!!selectedServer}
                    />
                    <Button
                        variant="outline"
                        size="s"
                        onClick={() => { setShowAddForm(false) }}
                    >
                        {t('Отмена')}
                    </Button>
                </VStack>
            )}

            {/* Add new server button */}
            {!showAddForm && (
                <Button
                    variant="outline"
                    onClick={() => {
                        setSelectedServerId(null)
                        setSelectedTool(null)
                        setShowAddForm(true)
                    }}
                >
                    {t('Добавить MCP сервер')}
                </Button>
            )}
        </VStack>
    )
})
