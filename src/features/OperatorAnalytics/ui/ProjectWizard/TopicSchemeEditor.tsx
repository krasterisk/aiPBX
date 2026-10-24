import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    MenuItem,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { OperatorProject } from '@/entities/Report'
import { SchemeResult, SchemeState, TopicScheme, topicSchemeApi } from './topicSchemeApi'
import { runTopicSchemeChecks } from './topicSchemeChecks'

export function initialTopicScheme(project: OperatorProject): TopicScheme {
    const topics = (project.callTaxonomy ?? []).map(t => ({
        id: t.id,
        name: t.name,
        when: t.description ?? '',
        exclude: '',
        examples: t.aliases ?? []
    }))
    return { version: 1, topics, fallbackTopicId: topics.find(t => /^(другое|other)$/i.test(t.name))?.id ?? topics.at(-1)?.id ?? '' }
}

export function canApplyScheme(state: SchemeState | null): boolean {
    const draft = state?.draft
    if (!draft || draft.checkRun?.status !== 'passed') return false
    const labelled = draft.checks.filter(c => c.expectedTopicId)
    return (
        labelled.length > 0 &&
        labelled.every(c => c.expectedTopicId === c.selectedTopicId) &&
        draft.scheme.topics.every(t => labelled.some(c => c.expectedTopicId === t.id))
    )
}

interface Props {
    project: OperatorProject
    onApplied: () => void
}

export function TopicSchemeEditor({ project, onApplied }: Props) {
    const { t } = useTranslation('reports')
    const { data, isLoading, error: loadError } = topicSchemeApi.useTopicSchemeQuery(project.id)
    const [saveDraft, { isLoading: saving }] = topicSchemeApi.useSaveTopicSchemeDraftMutation()
    const [check, { isLoading: checking }] = topicSchemeApi.useCheckTopicSchemeMutation()
    const [apply, { isLoading: applying }] = topicSchemeApi.useApplyTopicSchemeMutation()
    const [state, setState] = useState<SchemeState | null>(null)
    const [scheme, setScheme] = useState<TopicScheme>(() => initialTopicScheme(project))
    const [dirty, setDirty] = useState(false)
    const [text, setText] = useState('')
    const [expected, setExpected] = useState('')
    const [tests, setTests] = useState<Array<{ text: string, expectedTopicId: string }>>([])
    const [results, setResults] = useState<SchemeResult[]>([])
    const [error, setError] = useState('')
    const [confirmApply, setConfirmApply] = useState(false)
    const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null)
    const [tab, setTab] = useState(0)
    const [drag, setDrag] = useState<{ source: string, target: string } | null>(null)
    const dragRef = useRef<typeof drag>(null)
    const topicList = useRef<HTMLDivElement>(null)
    const updateDrag = (next: typeof drag) => {
        dragRef.current = next
        setDrag(next)
    }
    const [running, setRunning] = useState(false)
    const busy = saving || checking || applying || running
    const loadedVersion = useRef('')
    const mounted = useRef(true)
    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        }
    }, [])

    useEffect(() => {
        const key = `${project.id}:${data?.active?.revision ?? ''}:${data?.draft?.revision ?? ''}`
        if (data && !dirty && loadedVersion.current !== key) {
            loadedVersion.current = key
            setState(data)
            setScheme(data.draft?.scheme ?? data.active?.scheme ?? initialTopicScheme(project))
        }
    }, [data, project, dirty])

    const change = (next: TopicScheme) => {
        setScheme({
            ...next,
            topics: [...next.topics.filter(v => v.id !== next.fallbackTopicId), ...next.topics.filter(v => v.id === next.fallbackTopicId)]
        })
        setDirty(true)
        setConfirmApply(false)
        setResults([])
    }
    const field = (id: string, key: 'name' | 'when' | 'exclude' | 'examples', value: string) => {
        change({
            ...scheme,
            topics: scheme.topics.map(topic =>
                topic.id !== id
                    ? topic
                    : {
                          ...topic,
                          [key]: key === 'examples' ? value.split('\n') : value
                      }
            )
        })
    }
    const drop = () => {
        const current = dragRef.current
        updateDrag(null)
        if (!current || busy || current.source === current.target) return
        const topics = [...scheme.topics]
        const from = topics.findIndex(topic => topic.id === current.source && topic.id !== scheme.fallbackTopicId)
        const to = topics.findIndex(topic => topic.id === current.target && topic.id !== scheme.fallbackTopicId)
        if (from < 0 || to < 0) return
        topics.splice(to, 0, topics.splice(from, 1)[0])
        change({ ...scheme, topics })
    }
    const save = async () => {
        setError('')
        try {
            const updated = await saveDraft({
                id: project.id,
                expectedDraftRevision: state?.draft?.revision ?? null,
                ...(state?.draft?.businessContext !== undefined ? { businessContext: state.draft.businessContext } : {}),
                scheme: {
                    ...scheme,
                    topics: scheme.topics.map(topic => ({ ...topic, examples: topic.examples.map(s => s.trim()).filter(Boolean) }))
                }
            }).unwrap()
            setState(updated)
            setScheme(updated.draft!.scheme)
            setDirty(false)
            return updated
        } catch {
            setError(String(t('TOPIC_SCHEME_SAVE_ERROR')))
            return null
        }
    }
    const run = async (cases: Array<{ text: string, expectedTopicId?: string }>) => {
        setError('')
        setRunning(true)
        setConfirmApply(false)
        setResults([])
        try {
            const current = dirty || !state?.draft ? await save() : state
            if (!current?.draft) return
            await runTopicSchemeChecks(
                cases,
                async one => await check({ id: project.id, revision: current.draft!.revision, cases: one }).unwrap(),
                response => {
                    setState(response.state)
                    setResults(response.results)
                },
                () => !mounted.current
            )
        } catch {
            if (mounted.current) {
                setError(String(t('TOPIC_SCHEME_CHECK_ERROR')))
                setState(old =>
                    old?.draft ? { ...old, draft: { ...old.draft, checkRun: { id: old.draft.checkRun?.id ?? '', status: 'failed' } } } : old
                )
            }
        } finally {
            if (mounted.current) setRunning(false)
        }
    }
    const applyDraft = async () => {
        if (!state?.draft || dirty || !canApplyScheme(state) || !confirmApply) return
        try {
            await apply({ id: project.id, revision: state.draft.revision }).unwrap()
            onApplied()
        } catch {
            setError(String(t('TOPIC_SCHEME_APPLY_ERROR')))
        }
    }
    const name = (id: string) => scheme.topics.find(topic => topic.id === id)?.name ?? id

    if (isLoading) return <Typography>{t('TOPIC_SCHEME_LOADING')}</Typography>
    if (loadError) return <Alert severity="error">{t('TOPIC_SCHEME_LOAD_ERROR')}</Alert>
    return (
        <Stack spacing={2}>
            <Alert severity="info">{t('TOPIC_SCHEME_INTRO')}</Alert>
            {state?.draft?.businessContext !== undefined && (
                <TextField
                    label={t('TOPIC_SCHEME_DRAFT_CONTEXT')}
                    value={state.draft.businessContext ?? ''}
                    multiline
                    minRows={2}
                    maxRows={5}
                    fullWidth
                    InputProps={{ readOnly: true }}
                />
            )}
            {state?.active && (
                <Typography variant="caption">
                    {t('TOPIC_SCHEME_ACTIVE_VERSION', { date: new Date(state.active.createdAt).toLocaleString() })}
                </Typography>
            )}
            <Tabs
                value={tab}
                onChange={(_, value) => {
                    updateDrag(null)
                    setTab(value)
                }}
                aria-label={String(t('TOPIC_SCHEME_TABS'))}
            >
                <Tab id="topic-settings-tab" aria-controls="topic-settings-panel" label={t('TOPIC_SCHEME_SETTINGS')} />
                <Tab id="topic-check-tab" aria-controls="topic-check-panel" label={t('TOPIC_SCHEME_CHECK_TAB')} />
            </Tabs>
            <Box role="tabpanel" id="topic-settings-panel" aria-labelledby="topic-settings-tab" hidden={tab !== 0}>
                <Stack spacing={2} sx={{ minWidth: 0 }} ref={topicList}>
                    <Typography variant="subtitle2">{t('TOPIC_SCHEME_PRIORITY')}</Typography>
                    <Typography variant="body2">{t('TOPIC_SCHEME_PRIORITY_HINT')}</Typography>
                    <TextField
                        select
                        fullWidth
                        label={t('TOPIC_SCHEME_FALLBACK')}
                        value={scheme.fallbackTopicId}
                        onChange={e => {
                            change({ ...scheme, fallbackTopicId: e.target.value })
                        }}
                        disabled={busy}
                    >
                        {scheme.topics.map(topic => (
                            <MenuItem key={topic.id} value={topic.id}>
                                {topic.name || t('Новая тема')}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Typography id="topic-drag-help" variant="caption">
                        {t('TOPIC_SCHEME_DRAG_HINT')}
                    </Typography>
                    <Box role="status" aria-live="polite" sx={{ position: 'absolute', left: 0, top: 0, width: '1px', height: '1px', overflow: 'hidden', clipPath: 'inset(50%)' }}>
                        {drag ? `${t('TOPIC_SCHEME_PRIORITY')}: ${name(drag.source)}, ${scheme.topics.findIndex(topic => topic.id === drag.target) + 1}` : ''}
                    </Box>
                    {scheme.topics.map((topic, index) => (
                        <Box
                            key={topic.id}
                            data-topic-id={topic.id}
                            sx={{
                                opacity: drag?.source === topic.id ? 0.6 : 1,
                                outline: drag?.target === topic.id && drag.source !== topic.id ? '2px solid' : undefined,
                                outlineColor: 'primary.main',
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2
                            }}
                        >
                            <Stack spacing={1.5}>
                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                    {topic.id !== scheme.fallbackTopicId && (
                                        <IconButton
                                            aria-label={`${t('TOPIC_SCHEME_DRAG')}: ${topic.name}`}
                                            aria-describedby="topic-drag-help"
                                            aria-pressed={drag?.source === topic.id}
                                            disabled={busy}
                                            sx={{ cursor: drag?.source === topic.id ? 'grabbing' : 'grab', touchAction: 'none' }}
                                            onPointerDown={e => {
                                                if (e.button !== 0) return
                                                e.currentTarget.setPointerCapture(e.pointerId)
                                                updateDrag({ source: topic.id, target: topic.id })
                                            }}
                                            onPointerMove={e => {
                                                const current = dragRef.current
                                                if (!current || current.source !== topic.id) return
                                                const row = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-topic-id]')
                                                const target = row?.getAttribute('data-topic-id')
                                                if (target && target !== scheme.fallbackTopicId && topicList.current?.contains(row!)) {
                                                    updateDrag({ ...current, target })
                                                }
                                            }}
                                            onPointerUp={drop}
                                            onPointerCancel={() => {
                                                updateDrag(null)
                                            }}
                                            onLostPointerCapture={() => {
                                                updateDrag(null)
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === 'Escape') {
                                                    e.preventDefault()
                                                    updateDrag(null)
                                                    return
                                                }
                                                if (e.key === ' ' || e.key === 'Enter') {
                                                    e.preventDefault()
                                                    if (dragRef.current?.source === topic.id) drop()
                                                    else updateDrag({ source: topic.id, target: topic.id })
                                                }
                                                if (
                                                    (e.key === 'ArrowUp' || e.key === 'ArrowDown') &&
                                                    dragRef.current?.source === topic.id
                                                ) {
                                                    e.preventDefault()
                                                    const current = dragRef.current
                                                    const position = scheme.topics.findIndex(v => v.id === current.target)
                                                    const target = scheme.topics[position + (e.key === 'ArrowUp' ? -1 : 1)]
                                                    if (target && target.id !== scheme.fallbackTopicId) { updateDrag({ ...current, target: target.id }) }
                                                }
                                            }}
                                        >
                                            <DragIndicatorIcon />
                                        </IconButton>
                                    )}

                                    <Typography sx={{ flex: 1, minWidth: 120, overflowWrap: 'anywhere' }} fontWeight={600}>
                                        {topic.id === scheme.fallbackTopicId ? t('TOPIC_SCHEME_FALLBACK') : `${index + 1}.`} {topic.name}
                                    </Typography>
                                    <Button
                                        size="small"
                                        aria-expanded={expandedTopicId === topic.id}
                                        aria-controls={`topic-fields-${topic.id}`}
                                        aria-label={`${t('TOPIC_SCHEME_EDIT')}: ${topic.name}`}
                                        onClick={() => {
                                            setExpandedTopicId(expandedTopicId === topic.id ? null : topic.id)
                                        }}
                                    >
                                        {t('TOPIC_SCHEME_EDIT')}
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        disabled={busy || topic.id === scheme.fallbackTopicId || scheme.topics.length <= 2}
                                        onClick={() => {
                                            change({ ...scheme, topics: scheme.topics.filter(v => v.id !== topic.id) })
                                        }}
                                    >
                                        {t('Удалить')}
                                    </Button>
                                </Stack>
                                {expandedTopicId === topic.id && (
                                    <Stack spacing={1.5} id={`topic-fields-${topic.id}`}>
                                        <TextField
                                            label={t('Название темы')}
                                            value={topic.name}
                                            onChange={e => {
                                                field(topic.id, 'name', e.target.value)
                                            }}
                                            disabled={busy}
                                            fullWidth
                                        />
                                        {topic.id !== scheme.fallbackTopicId && (
                                            <>
                                                <TextField
                                                    label={t('TOPIC_SCHEME_WHEN')}
                                                    value={topic.when}
                                                    onChange={e => {
                                                        field(topic.id, 'when', e.target.value)
                                                    }}
                                                    multiline
                                                    minRows={2}
                                                    fullWidth
                                                    disabled={busy}
                                                />
                                                <TextField
                                                    label={t('TOPIC_SCHEME_EXCLUDE')}
                                                    value={topic.exclude}
                                                    onChange={e => {
                                                        field(topic.id, 'exclude', e.target.value)
                                                    }}
                                                    multiline
                                                    minRows={2}
                                                    fullWidth
                                                    disabled={busy}
                                                />
                                                <TextField
                                                    label={t('TOPIC_SCHEME_EXAMPLES')}
                                                    value={topic.examples.join('\n')}
                                                    onChange={e => {
                                                        field(topic.id, 'examples', e.target.value)
                                                    }}
                                                    multiline
                                                    minRows={2}
                                                    fullWidth
                                                    disabled={busy}
                                                />
                                            </>
                                        )}
                                    </Stack>
                                )}
                            </Stack>
                        </Box>
                    ))}
                    <Button
                        disabled={busy || scheme.topics.length >= 20}
                        onClick={() => {
                            change({
                                ...scheme,
                                topics: [...scheme.topics, { id: `tag_${Date.now()}`, name: '', when: '', exclude: '', examples: [] }]
                            })
                        }}
                    >
                        {t('TOPIC_SCHEME_ADD')}
                    </Button>
                    <Button
                        variant="outlined"
                        disabled={
                            busy ||
                            (!dirty &&
                                Boolean(state?.draft) &&
                                state?.draft?.checkRun?.status !== 'failed' &&
                                state?.draft?.checkRun?.status !== 'running')
                        }
                        onClick={save}
                    >
                        {t('TOPIC_SCHEME_SAVE_DRAFT')}
                    </Button>
                    <Typography variant="subtitle2">{t('TOPIC_SCHEME_HISTORY')}</Typography>
                    {state?.history
                        .slice()
                        .reverse()
                        .map(version => (
                            <Stack key={version.revision} direction="row" alignItems="center" spacing={1}>
                                <Typography variant="body2">{new Date(version.createdAt).toLocaleString()}</Typography>
                                <Button
                                    disabled={busy}
                                    onClick={() => {
                                        change(version.scheme)
                                        setTests([])
                                    }}
                                >
                                    {t('TOPIC_SCHEME_RESTORE')}
                                </Button>
                            </Stack>
                        ))}
                </Stack>
            </Box>
            <Box role="tabpanel" id="topic-check-panel" aria-labelledby="topic-check-tab" hidden={tab !== 1}>
                <Stack spacing={2} sx={{ minWidth: 0 }}>
                    <Typography variant="h6">{t('TOPIC_SCHEME_TEST')}</Typography>
                    <TextField
                        label={t('TOPIC_SCHEME_TRANSCRIPT')}
                        value={text}
                        onChange={e => {
                            setText(e.target.value)
                        }}
                        multiline
                        minRows={4}
                        fullWidth
                        disabled={busy}
                    />
                    <TextField
                        select
                        label={t('TOPIC_SCHEME_EXPECTED')}
                        value={expected}
                        onChange={e => {
                            setExpected(e.target.value)
                        }}
                        fullWidth
                        disabled={busy}
                    >
                        <MenuItem value="">{t('TOPIC_SCHEME_NO_EXPECTED')}</MenuItem>
                        {scheme.topics.map(topic => (
                            <MenuItem key={topic.id} value={topic.id}>
                                {topic.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Button
                            disabled={busy || text.trim().length < 10}
                            onClick={async () => {
                                await run([{ text, ...(expected ? { expectedTopicId: expected } : {}) }])
                            }}
                        >
                            {t('TOPIC_SCHEME_CHECK_ONE')}
                        </Button>
                        <Button
                            disabled={busy || !expected || text.trim().length < 10 || tests.length >= 100}
                            onClick={() => {
                                setTests(old => [...old, { text, expectedTopicId: expected }])
                                setText('')
                            }}
                        >
                            {t('TOPIC_SCHEME_SAVE_EXAMPLE')}
                        </Button>
                        <Button
                            disabled={busy || !tests.length}
                            onClick={async () => {
                                await run(tests)
                            }}
                        >
                            {t('TOPIC_SCHEME_CHECK_ALL', { count: tests.length })}
                        </Button>
                    </Stack>
                    {tests.map((test, index) => (
                        <Stack key={index} direction="row" alignItems="center" spacing={1}>
                            <Typography variant="body2" sx={{ flex: 1 }}>
                                {index + 1}. {name(test.expectedTopicId)} — {test.text.slice(0, 120)}
                            </Typography>
                            <Button
                                disabled={busy}
                                onClick={() => {
                                    setTests(old => old.filter((_, i) => i !== index))
                                }}
                            >
                                {t('TOPIC_SCHEME_REMOVE_TEST')}
                            </Button>
                        </Stack>
                    ))}
                    <Typography variant="caption">{t('TOPIC_SCHEME_TEST_PRIVACY')}</Typography>
                    {results.map((result, index) => (
                        <Alert
                            key={index}
                            severity={!result.expectedTopicId || result.topicIds[0] === result.expectedTopicId ? 'success' : 'error'}
                        >
                            <strong>{name(result.topicIds[0])}</strong> — {result.decision.reason}
                            {result.expectedTopicId && (
                                <div>
                                    {t('TOPIC_SCHEME_EXPECTED')}: {name(result.expectedTopicId)}
                                </div>
                            )}
                            {Object.entries(result.decision.evidence).map(([id, item]) => (
                                <div key={id}>
                                    {name(id)}: {item.matches ? '✓' : '—'} {item.reason}
                                </div>
                            ))}
                            <div>{result.model}</div>
                        </Alert>
                    ))}
                    {state?.draft && (
                        <Alert severity={canApplyScheme(state) ? 'success' : 'warning'}>
                            {t('TOPIC_SCHEME_CHECK_STATUS', {
                                passed: state.draft.checks.filter(c => c.expectedTopicId && c.expectedTopicId === c.selectedTopicId).length,
                                total: state.draft.checks.filter(c => c.expectedTopicId).length
                            })}{' '}
                            {t('TOPIC_SCHEME_APPLY_HINT')}
                        </Alert>
                    )}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={confirmApply}
                                onChange={(_, checked) => {
                                    setConfirmApply(checked)
                                }}
                                disabled={busy || dirty || !canApplyScheme(state)}
                            />
                        }
                        label={t('TOPIC_SCHEME_CONFIRM')}
                    />
                    <Button variant="contained" onClick={applyDraft} disabled={busy || dirty || !canApplyScheme(state) || !confirmApply}>
                        {t('TOPIC_SCHEME_APPLY')}
                    </Button>
                </Stack>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
        </Stack>
    )
}
