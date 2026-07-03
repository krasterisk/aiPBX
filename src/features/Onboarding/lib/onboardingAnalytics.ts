import { trackEvent } from '@/shared/config/analytics/initAnalytics'
import type { OnboardingProductPath } from '../model/types/onboarding'

export interface OnboardingEventParams {
  productPath?: OnboardingProductPath | null
  step?: number
  [key: string]: string | number | undefined | null
}

export function trackOnboardingEvent (name: string, params?: OnboardingEventParams): void {
  if (!params) {
    trackEvent(name)
    return
  }

  const clean: Record<string, string | number> = {}
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      clean[key] = typeof value === 'number' ? value : String(value)
    }
  })
  trackEvent(name, clean)
}

export function trackOnboardingStepEvent (
  step: number,
  productPath: OnboardingProductPath | null
): void {
  trackOnboardingEvent(`onboarding_step_${step}`, { step, productPath })
}
