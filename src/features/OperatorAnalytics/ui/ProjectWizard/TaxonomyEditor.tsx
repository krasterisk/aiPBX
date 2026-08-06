import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Card } from '@/shared/ui/redesigned/Card'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { Textarea } from '@/shared/ui/mui/Textarea'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { TagDefinition } from '@/entities/Report'

interface TaxonomyEditorProps {
    taxonomy: TagDefinition[]
    onChange: (taxonomy: TagDefinition[]) => void
}

function parseAliases(raw: string): string[] {
    return raw.split(',').map(s => s.trim()).filter(Boolean)
}

export const TaxonomyEditor = memo(({ taxonomy, onChange }: TaxonomyEditorProps) => {
    const { t } = useTranslation('reports')
    const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null)
    /** Raw comma-separated draft so typing spaces/commas does not fight controlled join() */
    const [aliasDraftById, setAliasDraftById] = useState<Record<string, string>>({})

    const handleAdd = useCallback(() => {
        onChange([
            ...taxonomy,
            { id: `tag_${Date.now()}`, name: '', aliases: [], description: '' },
        ])
    }, [taxonomy, onChange])

    const handleNameChange = useCallback((idx: number, name: string) => {
        onChange(taxonomy.map((tag, i) => (i === idx ? { ...tag, name } : tag)))
    }, [taxonomy, onChange])

    const handleDescriptionChange = useCallback((idx: number, description: string) => {
        onChange(taxonomy.map((tag, i) => (i === idx ? { ...tag, description } : tag)))
    }, [taxonomy, onChange])

    const handleAliasesDraftChange = useCallback((idx: number, tagId: string, raw: string) => {
        setAliasDraftById(prev => ({ ...prev, [tagId]: raw }))
        onChange(taxonomy.map((tag, i) => (
            i === idx ? { ...tag, aliases: parseAliases(raw) } : tag
        )))
    }, [taxonomy, onChange])

    const handleConfirmDelete = useCallback(() => {
        if (pendingDeleteIndex == null) return
        const removed = taxonomy[pendingDeleteIndex]
        onChange(taxonomy.filter((_, i) => i !== pendingDeleteIndex))
        if (removed) {
            setAliasDraftById(prev => {
                const next = { ...prev }
                delete next[removed.id]
                return next
            })
        }
        setPendingDeleteIndex(null)
    }, [pendingDeleteIndex, taxonomy, onChange])

    const pendingTheme = pendingDeleteIndex != null ? taxonomy[pendingDeleteIndex] : undefined

    return (
        <VStack gap={'12'} max>
            <Text
                text={String(t(
                    'Темы - метки для звонков. При анализе ИИ выбирает подходящие темы из справочника по смыслу разговора.',
                ))}
                size={'s'}
            />

            {taxonomy.length === 0 && (
                <Text
                    text={String(t('Добавьте темы - звонки начнут размечаться при следующем анализе.'))}
                    size={'s'}
                />
            )}

            {taxonomy.map((tag, idx) => (
                <Card
                    key={tag.id}
                    variant={'glass'}
                    border={'partial'}
                    padding={'16'}
                    max
                >
                    <VStack gap={'12'} max>
                        <HStack max justify={'between'} align={'center'}>
                            <Text text={tag.name || String(t('Новая тема'))} bold />
                            <Button
                                variant={'glass-action'}
                                color={'error'}
                                size={'s'}
                                aria-label={String(t('Удалить'))}
                                onClick={() => { setPendingDeleteIndex(idx) }}
                                addonLeft={<DeleteOutlineIcon fontSize={'small'} />}
                            >
                                {String(t('Удалить'))}
                            </Button>
                        </HStack>

                        <Textarea
                            label={String(t('Название темы'))}
                            value={tag.name}
                            onChange={e => { handleNameChange(idx, e.target.value) }}
                            size={'small'}
                            fullWidth
                            multiline={false}
                            helperText={String(t('TAXONOMY_NAME_HINT'))}
                        />

                        <Textarea
                            label={String(t('Описание (когда ставить тему)'))}
                            value={tag.description ?? ''}
                            onChange={e => { handleDescriptionChange(idx, e.target.value) }}
                            size={'small'}
                            fullWidth
                            multiline
                            minRows={2}
                            helperText={String(t('TAXONOMY_DESCRIPTION_HINT'))}
                            placeholder={String(t('TAXONOMY_DESCRIPTION_PLACEHOLDER'))}
                        />

                        <Textarea
                            label={String(t('Формулировки (необязательно)'))}
                            value={aliasDraftById[tag.id] ?? tag.aliases.join(', ')}
                            onChange={e => { handleAliasesDraftChange(idx, tag.id, e.target.value) }}
                            size={'small'}
                            fullWidth
                            multiline={false}
                            helperText={String(t('TAXONOMY_KEYWORDS_HINT'))}
                            placeholder={String(t('TAXONOMY_KEYWORDS_PLACEHOLDER'))}
                        />
                    </VStack>
                </Card>
            ))}

            <Button
                variant={'glass-action'}
                addonLeft={<AddIcon fontSize={'small'} />}
                onClick={handleAdd}
            >
                {String(t('Добавить тему'))}
            </Button>

            <Modal
                isOpen={pendingDeleteIndex != null}
                onClose={() => { setPendingDeleteIndex(null) }}
                elevated
            >
                <VStack gap={'16'} max>
                    <Text
                        title={String(t('Удалить тему «{{name}}»?', { name: pendingTheme?.name || String(t('Новая тема')) }))}
                        bold
                    />
                    <Text
                        text={String(t('Звонки, размеченные ранее, сохранят тег. Новые анализы перестанут его получать.'))}
                        size={'s'}
                    />
                    <HStack max justify={'end'} gap={'12'} wrap={'wrap'}>
                        <Button variant={'clear'} onClick={() => { setPendingDeleteIndex(null) }}>
                            {String(t('Отмена'))}
                        </Button>
                        <Button variant={'outline'} color={'error'} onClick={handleConfirmDelete}>
                            {String(t('Удалить тему'))}
                        </Button>
                    </HStack>
                </VStack>
            </Modal>
        </VStack>
    )
})
