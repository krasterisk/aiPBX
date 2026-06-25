import { trackEvent } from '@/shared/config/analytics/initAnalytics'
import { trackOnboardingEvent, trackOnboardingStepEvent } from './onboardingAnalytics'

jest.mock('@/shared/config/analytics/initAnalytics', () => ({
  trackEvent: jest.fn()
}))

const mockTrackEvent = trackEvent as jest.MockedFunction<typeof trackEvent>

describe('onboardingAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('trackOnboardingEvent', () => {
    it('calls trackEvent with name only when no params', () => {
      trackOnboardingEvent('onboarding_started')
      expect(mockTrackEvent).toHaveBeenCalledWith('onboarding_started')
    })

    it('strips null and undefined params', () => {
      trackOnboardingEvent('onboarding_skipped', {
        productPath: 'assistants',
        step: 2,
        projectId: undefined,
        extra: null
      })
      expect(mockTrackEvent).toHaveBeenCalledWith('onboarding_skipped', {
        productPath: 'assistants',
        step: 2
      })
    })

    it('forwards primary conversion event names unchanged', () => {
      trackOnboardingEvent('playground_call_success', { productPath: 'assistants' })
      trackOnboardingEvent('oa_first_analysis_complete', { productPath: 'analytics' })

      expect(mockTrackEvent).toHaveBeenCalledWith('playground_call_success', { productPath: 'assistants' })
      expect(mockTrackEvent).toHaveBeenCalledWith('oa_first_analysis_complete', { productPath: 'analytics' })
    })
  })

  describe('trackOnboardingStepEvent', () => {
    it('emits onboarding_step_{n} with step and productPath', () => {
      trackOnboardingStepEvent(3, 'analytics')
      expect(mockTrackEvent).toHaveBeenCalledWith('onboarding_step_3', {
        step: 3,
        productPath: 'analytics'
      })
    })
  })

  describe('event name constants (D-13)', () => {
    const expectedEvents = [
      'onboarding_started',
      'onboarding_product_assistants',
      'onboarding_product_analytics',
      'assistant_created',
      'playground_call_success',
      'oa_project_created',
      'oa_file_uploaded',
      'oa_first_analysis_complete',
      'onboarding_skipped',
      'onboarding_completed'
    ]

    it.each(expectedEvents)('accepts event name: %s', (eventName) => {
      trackOnboardingEvent(eventName)
      expect(mockTrackEvent).toHaveBeenCalledWith(eventName)
    })
  })
})
