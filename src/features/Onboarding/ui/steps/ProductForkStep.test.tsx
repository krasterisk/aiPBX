import { render, screen, fireEvent } from '@testing-library/react'
import { ProductForkStep } from './ProductForkStep'
import { trackOnboardingEvent } from '../../lib/onboardingAnalytics'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, fallback?: string) => fallback ?? _key,
    i18n: { language: 'ru' }
  })
}))

jest.mock('@/shared/lib/hooks/useAppDispatch/useAppDispatch', () => ({
  useAppDispatch: () => jest.fn()
}))

jest.mock('../../lib/onboardingAnalytics', () => ({
  trackOnboardingEvent: jest.fn()
}))

jest.mock('@/shared/assets/icons/aipbx_logo_v3.svg', () => () => <div data-testid="logo" />)

const mockTrack = trackOnboardingEvent as jest.MockedFunction<typeof trackOnboardingEvent>

describe('ProductForkStep', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders two product options', () => {
    render(<ProductForkStep />)

    expect(screen.getByTestId('onboarding-product-fork')).toBeInTheDocument()
    expect(screen.getByText('Голосовые ассистенты')).toBeInTheDocument()
    expect(screen.getByText('Речевая аналитика')).toBeInTheDocument()
    expect(screen.getByText('Начать с ассистентов')).toBeInTheDocument()
    expect(screen.getByText('Начать с аналитики')).toBeInTheDocument()
  })

  it('tracks onboarding_product_assistants and step 1 on assistants selection', () => {
    render(<ProductForkStep />)

    fireEvent.click(screen.getByTestId('onboarding-fork-assistants'))

    expect(mockTrack).toHaveBeenCalledWith('onboarding_product_assistants', { productPath: 'assistants' })
    expect(mockTrack).toHaveBeenCalledWith('onboarding_step_1', { productPath: 'assistants', step: 1 })
  })

  it('tracks onboarding_product_analytics and step 1 on analytics selection', () => {
    render(<ProductForkStep />)

    fireEvent.click(screen.getByTestId('onboarding-fork-analytics'))

    expect(mockTrack).toHaveBeenCalledWith('onboarding_product_analytics', { productPath: 'analytics' })
    expect(mockTrack).toHaveBeenCalledWith('onboarding_step_1', { productPath: 'analytics', step: 1 })
  })

  it('keeps equal CTA affordances on both product cards', () => {
    render(<ProductForkStep />)

    expect(screen.getByText('Начать с ассистентов')).toBeInTheDocument()
    expect(screen.getByText('Начать с аналитики')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Начать с ассистентов' })).not.toBeInTheDocument()
  })
})
