import { renderHook, act, waitFor } from '@testing-library/react'
import { trackEvent, fireAdsConversion } from '@/shared/config/analytics/initAnalytics'
import { useSignupData } from './useSignupData'

const mockDispatch = jest.fn()
const mockNavigate = jest.fn()

const tokenResponse = { token: 'tok', user: { id: '1', email: 'a@b.c' } }

let googleHandler: ((idToken: string) => void) | undefined
let telegramHandler: ((data: unknown) => void) | undefined

const googleUnwrap = jest.fn(() => Promise.resolve(tokenResponse))
const telegramUnwrap = jest.fn(() => Promise.resolve(tokenResponse))
const signupUnwrap = jest.fn(() => Promise.resolve(undefined))
const activateUnwrap = jest.fn(() => Promise.resolve(tokenResponse))

const googleSignup = jest.fn(() => ({ unwrap: googleUnwrap }))
const telegramSignup = jest.fn(() => ({ unwrap: telegramUnwrap }))
const userSignup = jest.fn(() => ({ unwrap: signupUnwrap }))
const signupActivateUser = jest.fn(() => ({ unwrap: activateUnwrap }))

jest.mock('@/shared/config/analytics/initAnalytics', () => ({
  trackEvent: jest.fn(),
  fireAdsConversion: jest.fn()
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}))

jest.mock('@/shared/lib/hooks/useAppDispatch/useAppDispatch', () => ({
  useAppDispatch: () => mockDispatch
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      signupForm: {
        email: 'user@example.com',
        activationCode: '123456',
        password: '',
        isLoading: false
      }
    })
}))

jest.mock('@/shared/lib/hooks/useGoogleLogin/useGoogleLogin', () => ({
  useGoogleLogin: (handler: (idToken: string) => void) => {
    googleHandler = handler
    return jest.fn()
  }
}))

jest.mock('@/shared/lib/hooks/useTelegramLogin/useTelegramLogin', () => ({
  useTelegramLogin: (handler: (data: unknown) => void) => {
    telegramHandler = handler
    return jest.fn()
  }
}))

jest.mock('@/entities/User', () => ({
  userActions: { setToken: (data: unknown) => ({ type: 'user/setToken', payload: data }) },
  useGoogleSignupUser: () => [googleSignup, { isLoading: false }],
  useTelegramSignupUser: () => [telegramSignup, { isLoading: false }],
  useSignupUser: () => [userSignup, { isLoading: false }],
  useActivateUser: () => [signupActivateUser, { isError: false, isLoading: false, error: undefined }]
}))

jest.mock('@/shared/lib/legal/versions', () => ({
  buildLegalAcceptanceItems: () => []
}))

const mockTrackEvent = trackEvent as jest.MockedFunction<typeof trackEvent>
const mockFireAdsConversion = fireAdsConversion as jest.MockedFunction<typeof fireAdsConversion>

describe('useSignupData funnel analytics (D-06/D-07)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    googleHandler = undefined
    telegramHandler = undefined
    googleUnwrap.mockImplementation(() => Promise.resolve(tokenResponse))
    telegramUnwrap.mockImplementation(() => Promise.resolve(tokenResponse))
    signupUnwrap.mockImplementation(() => Promise.resolve(undefined))
    activateUnwrap.mockImplementation(() => Promise.resolve(tokenResponse))
    ;(global as any).__ADS_SIGNUP_LABEL__ = '-B6_CK72wtMcEIyDxKA-'
  })

  it('fires signup_complete + Ads conversion on Google signup success', async () => {
    renderHook(() => useSignupData())

    await act(async () => {
      googleHandler?.('google-id-token')
    })

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith('signup_complete', { method: 'google' })
      expect(mockFireAdsConversion).toHaveBeenCalledWith('-B6_CK72wtMcEIyDxKA-')
    })
  })

  it('fires signup_complete + Ads conversion on Telegram signup success', async () => {
    renderHook(() => useSignupData())

    await act(async () => {
      telegramHandler?.({ id: 1, first_name: 'T' })
    })

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith('signup_complete', { method: 'telegram' })
      expect(mockFireAdsConversion).toHaveBeenCalledWith('-B6_CK72wtMcEIyDxKA-')
    })
  })

  it('fires signup_complete + Ads conversion on email activation success', async () => {
    const { result } = renderHook(() => useSignupData())

    await act(async () => {
      result.current.onSignupActivateClick()
    })

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith('signup_complete', { method: 'email' })
      expect(mockFireAdsConversion).toHaveBeenCalledWith('-B6_CK72wtMcEIyDxKA-')
    })
  })

  it('does NOT fire conversion on email-code-sent (onSignupClick)', async () => {
    const { result } = renderHook(() => useSignupData())

    await act(async () => {
      result.current.onSignupClick()
    })

    await waitFor(() => {
      expect(signupUnwrap).toHaveBeenCalled()
    })

    expect(mockTrackEvent).not.toHaveBeenCalledWith('signup_complete', expect.anything())
    expect(mockFireAdsConversion).not.toHaveBeenCalled()
  })

  it('does NOT fire conversion on Google signup failure', async () => {
    googleUnwrap.mockImplementation(() => Promise.reject(new Error('fail')))
    renderHook(() => useSignupData())

    await act(async () => {
      googleHandler?.('google-id-token')
    })

    await waitFor(() => {
      expect(googleUnwrap).toHaveBeenCalled()
    })

    expect(mockTrackEvent).not.toHaveBeenCalledWith('signup_complete', expect.anything())
    expect(mockFireAdsConversion).not.toHaveBeenCalled()
  })
})
