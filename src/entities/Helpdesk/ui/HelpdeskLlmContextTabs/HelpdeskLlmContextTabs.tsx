import { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import {
    useGetHelpdeskLlmContextQuery,
    useUpdateHelpdeskLlmContextOverrideMutation,
} from '../../api/helpdeskApi'

interface HelpdeskLlmContextTabsProps {
    clientKey: string | null
}

type TabId = 'summary' | 'llm'

export const HelpdeskLlmContextTabs = memo((props: HelpdeskLlmContextTabsProps) => {
    const { clientKey } = props
    const { t } = useTranslation('admin')
    const [activeTab, setActiveTab] = useState<TabId>('summary')
    const [draft, setDraft] = useState('')

    const { data, isLoading } = useGetHelpdeskLlmContextQuery(clientKey || '', {
        skip: !clientKey,
    })
    const [saveOverride, { isLoading: isSaving }] = useUpdateHelpdeskLlmContextOverrideMutation()

    useEffect(() => {
        if (data) {
            setDraft(data.rawMarkdown || '')
        }
    }, [data])

    const handleSave = useCallback(async () => {
        if (!clientKey) return
        await saveOverride({ clientKey, markdownOverride: draft || null })
    }, [clientKey, draft, saveOverride])

    if (!clientKey) {
        return <Text text={t('helpdesk.llm.noClient')} variant="accent" />
    }

    if (isLoading) {
        return <Text text={t('Loading...')} />
    }

    return (
        <VStack gap="16" max>
            <HStack gap="8">
                <Button
                    variant={activeTab === 'summary' ? 'glass-action' : 'clear'}
                    onClick={() => { setActiveTab('summary') }}
                >
                    {t('helpdesk.llm.summaryTab')}
                </Button>
                <Button
                    variant={activeTab === 'llm' ? 'glass-action' : 'clear'}
                    onClick={() => { setActiveTab('llm') }}
                >
                    {t('helpdesk.llm.contextTab')}
                </Button>
            </HStack>

            {activeTab === 'summary' ? (
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                    {data?.summaryMarkdown || t('helpdesk.llm.empty')}
                </pre>
            ) : (
                <VStack gap="12" max>
                    <Textarea
                        multiline
                        minRows={8}
                        fullWidth
                        value={draft}
                        onChange={(e) => { setDraft(e.target.value) }}
                        placeholder={String(t('helpdesk.llm.placeholder'))}
                    />
                    <Button variant="glass-action" disabled={isSaving} onClick={() => { handleSave().catch(console.error) }}>
                        {t('Save')}
                    </Button>
                </VStack>
            )}
        </VStack>
    )
})
