import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Button } from '@/shared/ui/redesigned/Button'
import { Tooltip } from '@mui/material'
import { Trash2, Info } from 'lucide-react'
import {
    McpToolPolicy,
    useGetMcpToolPolicies,
    useCreateMcpToolPolicy,
    useDeleteMcpToolPolicy
} from '@/entities/Mcp'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './McpPolicyManager.module.scss'

type PolicyType = 'param_restrict' | 'rate_limit' | 'require_approval'

interface McpPolicyManagerProps {
    className?: string
    toolId: number
}

const POLICY_TYPE_LABELS: Record<PolicyType, string> = {
    param_restrict: 'Ограничение параметров',
    rate_limit: 'Лимит вызовов',
    require_approval: 'Требуется одобрение',
}

export const McpPolicyManager = memo((props: McpPolicyManagerProps) => {
    const { className, toolId } = props
    const { t } = useTranslation('tools')

    const { data: policies } = useGetMcpToolPolicies(toolId)
    const [createPolicy, { isLoading: isCreating }] = useCreateMcpToolPolicy()
    const [deletePolicy] = useDeleteMcpToolPolicy()

    // Add form state
    const [showAddForm, setShowAddForm] = useState(false)
    const [newPolicyType, setNewPolicyType] = useState<PolicyType>('rate_limit')
    const [maxCallsPerMinute, setMaxCallsPerMinute] = useState('60')
    const [windowSeconds, setWindowSeconds] = useState('60')
    const [blockedParams, setBlockedParams] = useState('')

    const policyTypeOptions = useMemo(() => [
        { id: 'rate_limit', name: t('Лимит вызовов') },
        { id: 'param_restrict', name: t('Ограничение параметров') },
        { id: 'require_approval', name: t('Требуется одобрение') },
    ], [t])

    const onDeletePolicy = useCallback(async (policyId: number) => {
        try {
            await deletePolicy(policyId).unwrap()
            toast.success(t('Политика удалена'))
        } catch (e) {
            // Error toast handled by global toastMiddleware
        }
    }, [deletePolicy, t])

    const onAddPolicy = useCallback(async () => {
        let policyConfig: Record<string, any> = {}

        switch (newPolicyType) {
            case 'rate_limit':
                policyConfig = {
                    maxCallsPerMinute: parseInt(maxCallsPerMinute) || 60,
                    windowSeconds: parseInt(windowSeconds) || 60,
                }
                break
            case 'param_restrict':
                policyConfig = {
                    blockedParams: blockedParams
                        .split('\n')
                        .map(s => s.trim())
                        .filter(Boolean),
                }
                break
            case 'require_approval':
                policyConfig = {}
                break
        }

        try {
            await createPolicy({
                policyType: newPolicyType,
                policyConfig,
                mcpToolRegistryId: toolId,
            }).unwrap()
            toast.success(t('Политика создана'))
            setShowAddForm(false)
        } catch (e) {
            // Error toast handled by global toastMiddleware
        }
    }, [newPolicyType, maxCallsPerMinute, windowSeconds, blockedParams, createPolicy, toolId, t])

    const formatPolicyConfig = (policy: McpToolPolicy): string => {
        const cfg = policy.policyConfig
        const parts: string[] = []
        if (cfg.maxCallsPerMinute) parts.push(`max: ${cfg.maxCallsPerMinute}/min`)
        if (cfg.windowSeconds) parts.push(`window: ${cfg.windowSeconds}s`)
        if (cfg.blockedParams?.length) parts.push(`blocked: ${cfg.blockedParams.join(', ')}`)
        return parts.length > 0 ? parts.join(' | ') : '—'
    }

    return (
        <VStack gap="12" max className={classNames(cls.McpPolicyManager, {}, [className])}>
            <HStack gap="4" align="center">
                <Text text={t('Политики') || ''} size="s" bold className={cls.label} />
                <Tooltip
                    title={t('mcpPoliciesTooltip')}
                    arrow
                    placement="top"
                    enterTouchDelay={0}
                    leaveTouchDelay={3000}
                    slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                >
                    <span className={cls.tooltipIcon}><Info size={16} /></span>
                </Tooltip>
            </HStack>

            {/* Existing policies */}
            {policies && policies.length > 0
? (
                policies.map(policy => (
                    <HStack key={policy.id} max gap="8" align="center" className={cls.policyItem}>
                        <VStack gap="4" max>
                            <Text
                                text={t(POLICY_TYPE_LABELS[policy.policyType]) || policy.policyType}
                                size="s"
                                className={cls.policyType}
                            />
                            <Text
                                text={formatPolicyConfig(policy)}
                                size="s"
                                className={cls.policyConfig}
                            />
                        </VStack>
                        <Button
                            type="button"
                            className={cls.deleteBtn}
                            onClick={async () => { await onDeletePolicy(policy.id) }}
                            title={t('Удалить') || 'Delete'}
                            variant='glass-action'
                        >
                            <Trash2 size={14} />
                        </Button>
                    </HStack>
                ))
            )
: (
                <Text text={t('Нет политик')} size="s" className={cls.emptyText} />
            )}

            {/* Add form */}
            {showAddForm
? (
                <VStack gap="12" max className={cls.addForm}>
                    <Combobox
                        options={policyTypeOptions}
                        value={policyTypeOptions.find(o => o.id === newPolicyType) || policyTypeOptions[0]}
                        onChange={(_, v: any) => {
                            if (v && !Array.isArray(v)) setNewPolicyType(v.id as PolicyType)
                        }}
                        className={cls.fullWidth}
                        disableClearable
                        getOptionLabel={(option: any) => option.name}
                    />

                    {newPolicyType === 'rate_limit' && (
                        <>
                            <Textarea
                                placeholder={t('Макс. вызовов в минуту') ?? ''}
                                value={maxCallsPerMinute}
                                onChange={(e) => { setMaxCallsPerMinute(e.target.value) }}
                                className={cls.fullWidth}
                                size="small"
                            />
                            <Textarea
                                placeholder={t('Окно (секунды)') ?? ''}
                                value={windowSeconds}
                                onChange={(e) => { setWindowSeconds(e.target.value) }}
                                className={cls.fullWidth}
                                size="small"
                            />
                        </>
                    )}

                    {newPolicyType === 'param_restrict' && (
                        <Textarea
                            placeholder={t('Заблокированные параметры (по одному на строку)') ?? ''}
                            multiline
                            minRows={3}
                            value={blockedParams}
                            onChange={(e) => { setBlockedParams(e.target.value) }}
                            className={cls.fullWidth}
                        />
                    )}

                    <HStack gap="8">
                        <Button
                            variant="glass-action"
                            size="s"
                            onClick={onAddPolicy}
                            disabled={isCreating}
                        >
                            {t('Сохранить')}
                        </Button>
                        <Button
                            variant="clear"
                            size="s"
                            onClick={() => { setShowAddForm(false) }}
                        >
                            {t('Отмена')}
                        </Button>
                    </HStack>
                </VStack>
            )
: (
                <Button
                    variant="glass-action"
                    size="s"
                    onClick={() => { setShowAddForm(true) }}
                >
                    {t('Добавить политику')}
                </Button>
            )}
        </VStack>
    )
})
