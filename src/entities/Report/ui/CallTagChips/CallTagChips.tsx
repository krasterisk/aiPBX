import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { classNames } from '@/shared/lib/classNames/classNames'
import type { TagDefinition } from '../../model/types/report'
import cls from './CallTagChips.module.scss'

const BOUNDED_VISIBLE = 3

export function resolveTagDisplayName(
    tagId: string,
    tagNames?: Record<string, string>,
    taxonomy?: TagDefinition[],
): string {
    const snapshotName = tagNames?.[tagId]?.trim()
    if (snapshotName) return snapshotName

    const taxonomyName = taxonomy?.find(item => item.id === tagId)?.name?.trim()
    if (taxonomyName) return taxonomyName

    return tagId
}

export function resolveTagColor(
    tagId: string,
    taxonomy?: TagDefinition[],
): string | undefined {
    return taxonomy?.find(item => item.id === tagId)?.color
}

export interface CallTagChipsEditConfig {
    onRemove: (tagId: string) => void
    onAdd: (tagId: string) => void
    availableTags: TagDefinition[]
}

export interface CallTagChipsProps {
    className?: string
    tagIds?: string[]
    tagNames?: Record<string, string>
    taxonomy?: TagDefinition[]
    mode?: 'bounded' | 'unbounded'
    editable?: CallTagChipsEditConfig
    'data-testid'?: string
}

interface ResolvedTag {
    id: string
    name: string
    color?: string
}

export const CallTagChips = memo((props: CallTagChipsProps) => {
    const {
        className,
        tagIds = [],
        tagNames,
        taxonomy,
        mode = 'unbounded',
        editable,
        'data-testid': testId = 'call-tag-chips',
    } = props

    const { t } = useTranslation('reports')
    const [pickerOpen, setPickerOpen] = useState(false)

    const resolvedTags = useMemo<ResolvedTag[]>(() =>
        tagIds.map(id => ({
            id,
            name: resolveTagDisplayName(id, tagNames, taxonomy),
            color: resolveTagColor(id, taxonomy),
        })),
    [tagIds, tagNames, taxonomy])

    const fullListTitle = useMemo(
        () => resolvedTags.map(tag => tag.name).join(', '),
        [resolvedTags],
    )

    const visibleTags = mode === 'bounded'
        ? resolvedTags.slice(0, BOUNDED_VISIBLE)
        : resolvedTags

    const overflowCount = mode === 'bounded'
        ? Math.max(0, resolvedTags.length - BOUNDED_VISIBLE)
        : 0

    const handleRemove = useCallback((tagId: string) => {
        editable?.onRemove(tagId)
    }, [editable])

    const handleAdd = useCallback((tagId: string) => {
        editable?.onAdd(tagId)
        setPickerOpen(false)
    }, [editable])

    if (!resolvedTags.length) {
        return (
            <span className={classNames(cls.empty, {}, [className])} data-testid={`${testId}-empty`}>
                {String(t('Темы не найдены'))}
            </span>
        )
    }

    return (
        <div
            className={classNames(cls.root, {}, [className])}
            title={mode === 'bounded' ? fullListTitle : undefined}
            data-testid={testId}
        >
            {visibleTags.map(tag => (
                <span
                    key={tag.id}
                    className={cls.chip}
                    title={tag.name}
                    data-testid={`${testId}-chip-${tag.id}`}
                >
                    {tag.color ? (
                        <span
                            className={cls.colorDot}
                            style={{ backgroundColor: tag.color }}
                            aria-hidden
                        />
                    ) : null}
                    <span className={cls.chipLabel}>{tag.name}</span>
                    {editable ? (
                        <button
                            type="button"
                            className={cls.removeButton}
                            aria-label={String(t('Убрать тему {{name}}', { name: tag.name }))}
                            onClick={() => { handleRemove(tag.id) }}
                            data-testid={`${testId}-remove-${tag.id}`}
                        >
                            <X size={14} aria-hidden />
                        </button>
                    ) : null}
                </span>
            ))}

            {overflowCount > 0 ? (
                <span className={cls.overflowChip} data-testid={`${testId}-overflow`}>
                    +{overflowCount}
                </span>
            ) : null}

            {editable ? (
                <>
                    <button
                        type="button"
                        className={cls.addButton}
                        onClick={() => { setPickerOpen(prev => !prev) }}
                        data-testid={`${testId}-add`}
                    >
                        + {String(t('Добавить тему'))}
                    </button>
                    {pickerOpen && editable.availableTags.length > 0 ? (
                        <div className={cls.picker} data-testid={`${testId}-picker`}>
                            {editable.availableTags.map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    className={cls.pickerOption}
                                    onClick={() => { handleAdd(tag.id) }}
                                    data-testid={`${testId}-picker-option-${tag.id}`}
                                >
                                    {resolveTagDisplayName(tag.id, tagNames, taxonomy)}
                                </button>
                            ))}
                        </div>
                    ) : null}
                </>
            ) : null}
        </div>
    )
})
