import { projectWizardActions, projectWizardReducer } from './projectWizardSlice'
import type { ProjectWizardSchema } from '../types/projectWizardSchema'
import type { OperatorProject, TagDefinition } from '../types/report'

describe('projectWizardSlice callTaxonomy', () => {
    const taxonomy: TagDefinition[] = [
        { id: 'returns', name: 'Возвраты', aliases: ['возврат'], description: 'Клиент хочет вернуть товар' },
    ]

    it('starts with an empty taxonomy on openCreate', () => {
        const state = projectWizardReducer(undefined, projectWizardActions.openCreate())
        expect(state.callTaxonomy).toEqual([])
        expect(state.isOpen).toBe(true)
    })

    it('initCreateDraft resets fields without opening the modal', () => {
        const open = projectWizardReducer(undefined, projectWizardActions.openCreate())
        expect(open.isOpen).toBe(true)

        const draft = projectWizardReducer(open, projectWizardActions.initCreateDraft())
        expect(draft.isOpen).toBe(false)
        expect(draft.callTaxonomy).toEqual([])
        expect(draft.name).toBe('')
        expect(draft.editProjectId).toBeUndefined()
    })

    it('setCallTaxonomy replaces the taxonomy list', () => {
        let state = projectWizardReducer(undefined, projectWizardActions.openCreate())
        state = projectWizardReducer(state, projectWizardActions.setCallTaxonomy(taxonomy))
        expect(state.callTaxonomy).toEqual(taxonomy)
    })

    it('openEdit hydrates callTaxonomy from the project', () => {
        const project = {
            id: '1',
            name: 'Demo',
            callTaxonomy: taxonomy,
        } as OperatorProject

        const state = projectWizardReducer(undefined, projectWizardActions.openEdit(project))
        expect(state.callTaxonomy).toEqual(taxonomy)
        expect(state.editProjectId).toBe('1')
    })

    it('applyTemplate does not clear an existing taxonomy', () => {
        let state = projectWizardReducer(undefined, projectWizardActions.openCreate())
        state = projectWizardReducer(state, projectWizardActions.setCallTaxonomy(taxonomy))
        state = projectWizardReducer(state, projectWizardActions.applyTemplate({
            id: 'sales',
            name: 'Sales',
            systemPrompt: 'prompt',
            customMetricsSchema: [],
            visibleDefaultMetrics: ['greeting_quality'],
        } as any))

        expect(state.callTaxonomy).toEqual(taxonomy)
        expect(state.selectedTemplateId).toBe('sales')
    })

    it('keeps callTaxonomy on the schema type for create payloads', () => {
        const state: ProjectWizardSchema = projectWizardReducer(
            undefined,
            projectWizardActions.setCallTaxonomy(taxonomy),
        )
        const createPayload = {
            name: 'P',
            customMetricsSchema: state.customMetrics,
            visibleDefaultMetrics: state.visibleDefaultMetrics,
            callTaxonomy: state.callTaxonomy,
        }
        expect(createPayload.callTaxonomy).toEqual(taxonomy)
    })
})
