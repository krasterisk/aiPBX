import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { trackEvent } from '@/shared/config/analytics/initAnalytics'
import BillingPage from './BillingPage'

const mockNavigate = jest.fn()
const mockUnwrap = jest.fn()
const mockFetchRobokassaStatus = jest.fn(() => ({ unwrap: mockUnwrap }))

jest.mock('@/shared/config/analytics/initAnalytics', () => ({
  trackEvent: jest.fn()
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

jest.mock('@/entities/Payment', () => ({
  useLazyGetRobokassaStatusQuery: () => [mockFetchRobokassaStatus]
}))

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn()
}))

jest.mock('@/shared/assets/icons/check.svg', () => () => <div data-testid="check-icon" />)

jest.mock('@/widgets/Page', () => ({
  Page: ({ children }: { children: React.ReactNode }) => <div data-testid="BillingPage">{children}</div>
}))

jest.mock('@/shared/ui/redesigned/Stack', () => ({
  VStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

jest.mock('@/shared/ui/redesigned/Card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

jest.mock('@/shared/ui/redesigned/Icon', () => ({
  Icon: () => <span />
}))

jest.mock('@/shared/ui/redesigned/Button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => (
    <button type="button" onClick={onClick}>{children}</button>
  )
}))

jest.mock('@/shared/ui/redesigned/Text', () => ({
  Text: ({ title, text }: { title?: string, text?: string }) => (
    <div>{title}{text}</div>
  )
}))

const mockTrackEvent = trackEvent as jest.MockedFunction<typeof trackEvent>

function renderBilling (route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <BillingPage />
    </MemoryRouter>
  )
}

describe('BillingPage payment_success analytics (D-06)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUnwrap.mockReset()
    mockFetchRobokassaStatus.mockImplementation(() => ({ unwrap: mockUnwrap }))
  })

  it('fires payment_success once when Robokassa status is succeeded', async () => {
    mockUnwrap.mockResolvedValue({ status: 'succeeded' })

    renderBilling('/billing?provider=robokassa&InvId=42&status=ok')

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith('payment_success')
    })
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Оплата прошла успешно')).toBeInTheDocument()
  })

  it('does NOT fire payment_success on Robokassa fail status', async () => {
    renderBilling('/billing?provider=robokassa&InvId=42&status=fail')

    await waitFor(() => {
      expect(screen.getByText('Оплата не удалась')).toBeInTheDocument()
    })

    expect(mockTrackEvent).not.toHaveBeenCalled()
    expect(mockFetchRobokassaStatus).not.toHaveBeenCalled()
  })

  it('does NOT fire payment_success while Robokassa is pending', async () => {
    mockUnwrap.mockResolvedValue({ status: 'pending' })

    renderBilling('/billing?provider=robokassa&InvId=42&status=ok')

    await waitFor(() => {
      expect(screen.getByText('Платёж обрабатывается')).toBeInTheDocument()
    })

    expect(mockTrackEvent).not.toHaveBeenCalled()
  })

  it('does NOT fire payment_success on mount before verification resolves', () => {
    let resolveUnwrap: (value: { status: string }) => void = () => undefined
    mockUnwrap.mockImplementation(async () => await new Promise((resolve) => {
      resolveUnwrap = resolve
    }))

    renderBilling('/billing?provider=robokassa&InvId=42&status=ok')

    expect(screen.getByText('Verifying Payment')).toBeInTheDocument()
    expect(mockTrackEvent).not.toHaveBeenCalled()

    resolveUnwrap({ status: 'succeeded' })
  })
})
