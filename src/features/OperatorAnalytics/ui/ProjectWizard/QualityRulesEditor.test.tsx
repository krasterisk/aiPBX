import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QualityRulesEditor } from './QualityRulesEditor'
const save = jest.fn()
const rule = { id: 'speed', origin: 'custom', type: 'number', name: 'Speed', included: false, weight: 1, critical: 'none', normalization: { kind: 'linear', min: 0, max: 5 } }
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))
jest.mock('@/entities/Report', () => ({
    ...jest.requireActual('@/entities/Report/model/types/quality'),
    useGetQualityRulesQuery: () => ({ currentData: { enabled: true, minimumCoverage: 0.8, criteria: [rule], config: {}, revisionId: 'abc123' } }),
    useSaveQualityRulesMutation: () => [save, {}]
}))
it('saves explicit weights, scale polarity and coverage without changing historical evaluations', async () => {
    save.mockReturnValue({ unwrap: async () => ({}) })
    render(<QualityRulesEditor projectId={5} />)
    fireEvent.click(screen.getByLabelText('include'))
    fireEvent.change(screen.getByLabelText('weight'), { target: { value: '3' } })
    fireEvent.click(screen.getByLabelText('inverted'))
    fireEvent.change(screen.getByLabelText(/coverage/), { target: { value: '90' } })
    fireEvent.click(screen.getByRole('button', { name: 'save' }))
    await waitFor(() => { expect(save).toHaveBeenCalledWith({ id: 5, config: { minimumCoverage: 0.9, criteria: { 'custom:speed': { included: true, weight: 3, normalization: { kind: 'linear', min: 0, max: 5, inverted: true } } } } }) })
    expect(rule.included).toBe(false)
    expect(await screen.findByRole('status')).toHaveTextContent('saved')
})
