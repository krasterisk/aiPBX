import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { canApplyScheme, TopicSchemeEditor } from './TopicSchemeEditor'
import type { SchemeState } from './topicSchemeApi'

const save = jest.fn()
const check = jest.fn()
const apply = jest.fn()
const project: any = {
    id: '5',
    callTaxonomy: [
        { id: 'a', name: 'Запрос на запись', description: 'Новая запись', aliases: [] },
        { id: 'b', name: 'Сервисные', description: 'Результаты', aliases: [] },
        { id: 'c', name: 'Другое', description: '', aliases: [] }
    ]
}
const scheme = {
    version: 1 as const,
    fallbackTopicId: 'c',
    topics: project.callTaxonomy.map((v: any) => ({ id: v.id, name: v.name, when: v.description, exclude: '', examples: [] }))
}
const base: SchemeState = { active: null, draft: null, history: [] }
const ready: SchemeState = {
    ...base,
    draft: {
        revision: 'revision',
        scheme,
        createdAt: '',
        checkRun: { id: 'run', status: 'passed' },
        checks: ['a', 'b', 'c'].map(id => ({ expectedTopicId: id, selectedTopicId: id, inputHash: id, model: 'flash', checkedAt: '' }))
    }
}
let response = base

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))
jest.mock('./topicSchemeApi', () => ({
    topicSchemeApi: {
        useTopicSchemeQuery: () => ({ data: response }),
        useSaveTopicSchemeDraftMutation: () => [save, {}],
        useCheckTopicSchemeMutation: () => [check, {}],
        useApplyTopicSchemeMutation: () => [apply, {}]
    }
}))

describe('topic scheme workflow', () => {
    beforeEach(() => {
        response = base
        jest.clearAllMocks()
    })

    it('never allows apply before all labelled topics pass or while checking', () => {
        expect(canApplyScheme(base)).toBe(false)
        expect(canApplyScheme(ready)).toBe(true)
        expect(canApplyScheme({ ...ready, draft: { ...ready.draft!, checkRun: { id: 'x', status: 'running' } } })).toBe(false)
        expect(canApplyScheme({ ...ready, draft: { ...ready.draft!, checks: ready.draft!.checks.slice(0, 2) } })).toBe(false)
        expect(
            canApplyScheme({
                ...ready,
                draft: { ...ready.draft!, checks: [...ready.draft!.checks, { ...ready.draft!.checks[0], selectedTopicId: 'c' }] }
            })
        ).toBe(false)
    })

    it('reorders a draft without applying it or changing stable topic ids', async () => {
        save.mockReturnValue({ unwrap: async () => ready })
        render(<TopicSchemeEditor project={project} onApplied={jest.fn()} />)
        const handle = screen.getByRole('button', { name: 'TOPIC_SCHEME_DRAG: Сервисные' })
        fireEvent.keyDown(handle, { key: ' ' })
        fireEvent.keyDown(handle, { key: 'ArrowUp' })
        fireEvent.keyDown(handle, { key: 'Enter' })
        fireEvent.click(screen.getByRole('button', { name: 'TOPIC_SCHEME_SAVE_DRAFT' }))
        await waitFor(() => {
            expect(save).toHaveBeenCalled()
        })
        expect(save.mock.calls[0][0].scheme.topics.map((v: any) => v.id)).toEqual(['b', 'a', 'c'])
        expect(apply).not.toHaveBeenCalled()
    })

    it('invalidates apply as soon as checked criteria are edited', () => {
        response = ready
        render(<TopicSchemeEditor project={project} onApplied={jest.fn()} />)
        fireEvent.click(screen.getByRole('tab', { name: 'TOPIC_SCHEME_CHECK_TAB' }))
        fireEvent.click(screen.getByRole('checkbox', { name: 'TOPIC_SCHEME_CONFIRM' }))
        expect(screen.getByRole('button', { name: 'TOPIC_SCHEME_APPLY' })).not.toBeDisabled()
        fireEvent.click(screen.getByRole('tab', { name: 'TOPIC_SCHEME_SETTINGS' }))
        fireEvent.click(screen.getByRole('button', { name: 'TOPIC_SCHEME_EDIT: Запрос на запись' }))
        fireEvent.change(screen.getByDisplayValue('Новая запись'), { target: { value: 'Changed eligibility' } })
        fireEvent.click(screen.getByRole('tab', { name: 'TOPIC_SCHEME_CHECK_TAB' }))
        expect(screen.getByRole('button', { name: 'TOPIC_SCHEME_APPLY' })).toBeDisabled()
    })

    it('keeps test text across tabs and hides testing from settings', () => {
        render(<TopicSchemeEditor project={project} onApplied={jest.fn()} />)
        expect(screen.queryByLabelText('TOPIC_SCHEME_TRANSCRIPT')).not.toBeVisible()
        fireEvent.click(screen.getByRole('tab', { name: 'TOPIC_SCHEME_CHECK_TAB' }))
        fireEvent.change(screen.getByLabelText('TOPIC_SCHEME_TRANSCRIPT'), { target: { value: 'Test transcript' } })
        fireEvent.click(screen.getByRole('tab', { name: 'TOPIC_SCHEME_SETTINGS' }))
        expect(screen.getByDisplayValue('Test transcript')).not.toBeVisible()
        fireEvent.click(screen.getByRole('tab', { name: 'TOPIC_SCHEME_CHECK_TAB' }))
        expect(screen.getByDisplayValue('Test transcript')).toBeVisible()
    })

    it('supports pointer dragging and keeps the fallback fixed', async () => {
        save.mockReturnValue({ unwrap: async () => ready })
        render(<TopicSchemeEditor project={project} onApplied={jest.fn()} />)
        const handle = screen.getByRole('button', { name: 'TOPIC_SCHEME_DRAG: Сервисные' })
        expect(screen.queryByRole('button', { name: 'TOPIC_SCHEME_DRAG: Другое' })).not.toBeInTheDocument()
        const booking = screen.getByText('1. Запрос на запись').closest('[data-topic-id]')!
        const originalPointer = window.PointerEvent
        window.PointerEvent = MouseEvent as typeof PointerEvent
        const originalHitTest = document.elementFromPoint
        document.elementFromPoint = jest.fn().mockReturnValue(booking)
        handle.setPointerCapture = jest.fn()
        try {
            fireEvent.pointerDown(handle, { button: 0, clientX: 10, clientY: 150 })
            fireEvent.pointerMove(handle, { clientX: 10, clientY: 50 })
            fireEvent.pointerUp(handle)
            fireEvent.click(screen.getByRole('button', { name: 'TOPIC_SCHEME_SAVE_DRAFT' }))
            await waitFor(() => {
                expect(save).toHaveBeenCalled()
            })
            expect(save.mock.calls[0][0].scheme.topics.map((v: any) => v.id)).toEqual(['b', 'a', 'c'])
        } finally {
            window.PointerEvent = originalPointer
            document.elementFromPoint = originalHitTest
        }
    })

    it('requires fresh checking after priority changes', () => {
        response = ready
        render(<TopicSchemeEditor project={project} onApplied={jest.fn()} />)
        fireEvent.click(screen.getByRole('tab', { name: 'TOPIC_SCHEME_CHECK_TAB' }))
        fireEvent.click(screen.getByRole('checkbox', { name: 'TOPIC_SCHEME_CONFIRM' }))
        fireEvent.click(screen.getByRole('tab', { name: 'TOPIC_SCHEME_SETTINGS' }))
        const handle = screen.getByRole('button', { name: 'TOPIC_SCHEME_DRAG: Сервисные' })
        fireEvent.keyDown(handle, { key: ' ' })
        fireEvent.keyDown(handle, { key: 'ArrowUp' })
        fireEvent.keyDown(handle, { key: ' ' })
        fireEvent.click(screen.getByRole('tab', { name: 'TOPIC_SCHEME_CHECK_TAB' }))
        expect(screen.getByRole('checkbox', { name: 'TOPIC_SCHEME_CONFIRM' })).not.toBeChecked()
        expect(screen.getByRole('button', { name: 'TOPIC_SCHEME_APPLY' })).toBeDisabled()
    })

    it('cancels keyboard dragging without changing the checked draft', () => {
        response = ready
        render(<TopicSchemeEditor project={project} onApplied={jest.fn()} />)
        const handle = screen.getByRole('button', { name: 'TOPIC_SCHEME_DRAG: Сервисные' })
        fireEvent.keyDown(handle, { key: ' ' })
        fireEvent.keyDown(handle, { key: 'ArrowDown' })
        fireEvent.keyDown(handle, { key: 'ArrowUp' })
        fireEvent.keyDown(handle, { key: 'Escape' })
        expect(screen.getByRole('button', { name: 'TOPIC_SCHEME_SAVE_DRAFT' })).toBeDisabled()
    })

    it('requires explicit confirmation and sends the checked revision only', async () => {
        response = ready
        const done = jest.fn()
        apply.mockReturnValue({ unwrap: async () => ({ ...ready, active: ready.draft, draft: null }) })
        render(<TopicSchemeEditor project={project} onApplied={done} />)
        fireEvent.click(screen.getByRole('tab', { name: 'TOPIC_SCHEME_CHECK_TAB' }))
        expect(screen.getByRole('button', { name: 'TOPIC_SCHEME_APPLY' })).toBeDisabled()
        fireEvent.click(screen.getByRole('tab', { name: 'TOPIC_SCHEME_CHECK_TAB' }))
        fireEvent.click(screen.getByRole('checkbox', { name: 'TOPIC_SCHEME_CONFIRM' }))
        fireEvent.click(screen.getByRole('button', { name: 'TOPIC_SCHEME_APPLY' }))
        await waitFor(() => {
            expect(done).toHaveBeenCalled()
        })
        expect(apply).toHaveBeenCalledWith({ id: '5', revision: 'revision' })
    })
})
