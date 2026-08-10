import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { DisconnectInfo } from '@/features/PlaygroundSession'
import PlaygroundPage from './Playground'

const mockDispatch = jest.fn()
const mockTrackOnboardingEvent = jest.fn()
const mockTrackEvent = jest.fn()
let capturedOnDisconnect: ((info: DisconnectInfo) => void) | undefined

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}))

jest.mock('react-redux', () => ({
    useSelector: (sel: (s: unknown) => unknown) => sel({}),
}))

jest.mock('@/shared/lib/hooks/useAppDispatch/useAppDispatch', () => ({
    useAppDispatch: () => mockDispatch,
}))

jest.mock('@/features/Onboarding', () => ({
    onboardingActions: {
        setPlaygroundCallCompleted: (v: boolean) => ({ type: 'setPlaygroundCallCompleted', payload: v }),
        resumeForPostSuccess: () => ({ type: 'resumeForPostSuccess' }),
    },
    getOnboardingProductPath: () => 'assistants',
    getOnboardingPlaygroundCallCompleted: () => false,
    trackOnboardingEvent: (...args: unknown[]) => mockTrackOnboardingEvent(...args),
}))

jest.mock('@/shared/config/analytics/initAnalytics', () => ({
    trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
}))

jest.mock('react-toastify', () => ({
    toast: { success: jest.fn(), error: jest.fn() },
}))

jest.mock('@/widgets/Page', () => ({
    Page: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/features/PlaygroundSession', () => ({
    PlaygroundSessionV2: (props: { onSessionDisconnect?: (info: DisconnectInfo) => void }) => {
        capturedOnDisconnect = props.onSessionDisconnect
        return (
            <button
                type="button"
                onClick={() => {
                    props.onSessionDisconnect?.({ wasConnected: true, connectedDurationMs: 10_000 })
                }}
            >
                simulate-disconnect
            </button>
        )
    },
}))

describe('Playground page disconnect analytics (PG-UX-08)', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        capturedOnDisconnect = undefined
    })

    it('passes DisconnectInfo through to page handler and records ≥10s success', () => {
        render(
            <MemoryRouter initialEntries={['/playground?onboarding=assistants']}>
                <PlaygroundPage />
            </MemoryRouter>
        )

        expect(typeof capturedOnDisconnect).toBe('function')
        fireEvent.click(screen.getByText('simulate-disconnect'))

        expect(mockTrackOnboardingEvent).toHaveBeenCalledWith('playground_call_success', {
            productPath: 'assistants',
        })
        expect(mockTrackEvent).toHaveBeenCalledWith('first_call')
        expect(mockDispatch).toHaveBeenCalled()
    })
})
