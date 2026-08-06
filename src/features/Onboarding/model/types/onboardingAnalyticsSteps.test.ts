import { ANALYTICS_MAX_STEP, getMaxStepForPath, getTotalStepsForPath } from './onboarding'

describe('analytics onboarding step count', () => {
    it('exposes five analytics steps: welcome, name, metrics, topics, upload', () => {
        expect(ANALYTICS_MAX_STEP).toBe(5)
        expect(getMaxStepForPath('analytics')).toBe(5)
        expect(getTotalStepsForPath('analytics')).toBe(5)
    })

    it('leaves assistants path at five steps', () => {
        expect(getMaxStepForPath('assistants')).toBe(5)
        expect(getTotalStepsForPath('assistants')).toBe(5)
    })
})
