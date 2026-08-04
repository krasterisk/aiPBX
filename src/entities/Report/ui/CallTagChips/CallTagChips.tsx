import { FormEvent, memo, useCallback, useMemo, useState } from 'react'
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

/** Stable id for a free-form theme label (used when project has no taxonomy). */
export function slugifyTagId(label: string): string {
    const slug = label
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\p{L}\p{N}-]+/gu, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 50)
    return slug || `tag-${Date.now().toString(36)}`
}

export interface CallTagChipsEditConfig {
    onRemove: (tagId: string) => void
    onAdd: (tagId: string) => void
    availableTags: TagDefinition[]
    allowCustom?: boolean
    onAddCustom?: (label: string) => void
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
    const [customLabel, setCustomLabel] = useState('')

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

    const canOpenPicker = Boolean(
        editable && (editable.availableTags.length > 0 || editable.allowCustom),
    )

    const handleRemove = useCallback((tagId: string) => {
        editable?.onRemove(tagId)
    }, [editable])

    const handleAdd = useCallback((tagId: string) => {
        editable?.onAdd(tagId)
        setPickerOpen(false)
        setCustomLabel('')
    }, [editable])

    const handleCustomSubmit = useCallback((event: FormEvent) => {
        event.preventDefault()
        const label = customLabel.trim()
        if (!label || !editable?.onAddCustom) return
        editable.onAddCustom(label)
        setCustomLabel('')
        setPickerOpen(false)
    }, [customLabel, editable])

    // Read-only empty: render nothing (no "not found" noise).
    if (!resolvedTags.length && !editable) {
        return null
    }

    return (
        <div
            className={classNames(cls.root, {}, [className])}
            title={mode === 'bounded' && resolvedTags.length ? fullListTitle : undefined}
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
                    {String(t('+{{count}}', { count: overflowCount }))}
                </span>
            ) : null}

            {editable && canOpenPicker ? (
                <>
                    <button
                        type="button"
                        className={cls.addButton}
                        onClick={() => { setPickerOpen(prev => !prev) }}
                        data-testid={`${testId}-add`}
                    >
                        {String(t('+ Добавить тему'))}
                    </button>
                    {pickerOpen ? (
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
                            {editable.allowCustom && editable.onAddCustom ? (
                                <form
                                    className={cls.customForm}
                                    onSubmit={handleCustomSubmit}
                                    data-testid={`${testId}-custom-form`}
                                >
                                    <input
                                        className={cls.customInput}
                                        type="text"
                                        value={customLabel}
                                        maxLength={50}
                                        placeholder={String(t('Название темы'))}
                                        onChange={e => { setCustomLabel(e.target.value) }}
                                        data-testid={`${testId}-custom-input`}
                                    />
                                    <button
                                        type="submit"
                                        className={cls.customSubmit}
                                        disabled={!customLabel.trim()}
                                        data-testid={`${testId}-custom-submit`}
                                    >
                                        {String(t('Добавить'))}
                                    </button>
                                </form>
                            ) : null}
                        </div>
                    ) : null}
                </>
            ) : null}
        </div>
    )
})
