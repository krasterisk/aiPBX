import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { McpServer, useConnectMcpServer, useDisconnectMcpServer } from '@/entities/Mcp'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ConnectButton.module.scss'

interface ConnectButtonProps {
    className?: string
    server: McpServer
}

export const ConnectButton = memo((props: ConnectButtonProps) => {
    const { className, server } = props
    const { t } = useTranslation('tools')

    const [connectServer, { isLoading: isConnecting }] = useConnectMcpServer()
    const [disconnectServer, { isLoading: isDisconnecting }] = useDisconnectMcpServer()
    const isLoading = isConnecting || isDisconnecting
    const isActive = server.status === 'active'

    const onToggleConnection = useCallback(async () => {
        try {
            if (isActive) {
                await disconnectServer(server.id).unwrap()
                toast.success(t('Сервер отключён'))
            } else {
                await connectServer(server.id).unwrap()
                toast.success(t('Сервер подключён'))
            }
        } catch (e) {
            // Error toast handled by global toastMiddleware
        }
    }, [isActive, server.id, connectServer, disconnectServer, t])

    const statusClass = server.status === 'active'
        ? cls.active
        : server.status === 'error'
            ? cls.error
            : cls.inactive

    return (
        <VStack gap="8" className={classNames(cls.ConnectButton, {}, [className])}>
            <HStack gap="8" align="center">
                <div className={classNames(cls.statusDot, {}, [statusClass])} />
                <Text
                    text={
                        server.status === 'active'
                            ? t('Подключён')
                            : server.status === 'error'
                                ? t('Ошибка')
                                : t('Отключён')
                    }
                    size="s"
                />
                <Button
                    variant={isActive ? 'outline' : 'filled'}
                    onClick={onToggleConnection}
                    disabled={isLoading}
                    size="s"
                >
                    {isLoading
                        ? '...'
                        : isActive
                            ? t('Отключить')
                            : t('Подключить')
                    }
                </Button>
            </HStack>
            {server.lastError && server.status === 'error' && (
                <Text text={server.lastError} size="s" className={cls.errorText} />
            )}
        </VStack>
    )
})
