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

const generateId = (name: string): string =>
    name.toLowerCase().replace(/[^a-zа-яё0-9]/gi, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') || `tag_${Date.now()}`

export const TaxonomyEditor = memo(({ taxonomy, onChange }: TaxonomyEditorProps) => {
    const { t } = useTranslation('reports')
    const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null)

    const handleAdd = useCallback(() => {
        onChange([
            ...taxonomy,
            { id: `tag_${Date.now()}`, name: '', aliases: [] },
        ])
    }, [taxonomy, onChange])

    const handleChange = useCallback((idx: number, field: keyof TagDefinition, value: TagDefinition[keyof TagDefinition]) => {
        const updated = taxonomy.map((tag, i) => {
            if (i !== idx) return tag
            const next = { ...tag, [field]: value }
            if (field === 'name' && typeof value === 'string') {
                next.id = generateId(value)
            }
            return next
        })
        onChange(updated)
    }, [taxonomy, onChange])

    const handleConfirmDelete = useCallback(() => {
        if (pendingDeleteIndex == null) return
        onChange(taxonomy.filter((_, i) => i !== pendingDeleteIndex))
        setPendingDeleteIndex(null)
    }, [pendingDeleteIndex, taxonomy, onChange])

    const pendingTheme = pendingDeleteIndex != null ? taxonomy[pendingDeleteIndex] : undefined

    return (
        <VStack gap={'12'} max>
            {taxonomy.length === 0 && (
                <Text
                    text={String(t('Добавьте темы и ключевые слова — звонки начнут размечаться при следующем анализе.'))}
                    size={'s'}
                />
            )}

            {taxonomy.map((tag, idx) => (
                <Card
                    key={`${tag.id}-${idx}`}
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
                            onChange={e => { handleChange(idx, 'name', e.target.value) }}
                            size={'small'}
                            fullWidth
                            multiline={false}
                        />

                        <Textarea
                            label={String(t('Синонимы (через запятую)'))}
                            value={tag.aliases.join(', ')}
                            onChange={e => {
                                handleChange(
                                    idx,
                                    'aliases',
                                    e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                                )
                            }}
                            size={'small'}
                            fullWidth
                            multiline={false}
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
