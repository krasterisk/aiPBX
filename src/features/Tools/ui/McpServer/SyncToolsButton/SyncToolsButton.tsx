import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { RefreshCw } from 'lucide-react'
import { useSyncMcpTools } from '@/entities/Mcp'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './SyncToolsButton.module.scss'

interface SyncToolsButtonProps {
    className?: string
    serverId: number
    disabled?: boolean
}

export const SyncToolsButton = memo((props: SyncToolsButtonProps) => {
    const { className, serverId, disabled } = props
    const { t } = useTranslation('tools')

    const [syncTools, { isLoading }] = useSyncMcpTools()

    const onSync = useCallback(async () => {
        try {
            const tools = await syncTools(serverId).unwrap()
            toast.success(t('Синхронизировано tools: {{count}}', { count: tools.length }))
        } catch (e) {
            // Error toast handled by global toastMiddleware
        }
    }, [syncTools, serverId, t])

    return (
        <HStack gap="8" align="center" className={classNames(cls.SyncToolsButton, {}, [className])}>
            <Button
                variant="outline"
                onClick={onSync}
                disabled={disabled || isLoading}
                size="s"
                addonLeft={
                    <RefreshCw size={14} className={isLoading ? cls.spinner : undefined} />
                }
            >
                {t('Синхронизировать')}
            </Button>
        </HStack>
    )
})
