import { classNames } from '@/shared/lib/classNames/classNames'
import { useTranslation } from 'react-i18next'
import cls from './Playground.module.scss'
import { memo, useCallback, useMemo } from 'react'
import { Page } from '@/widgets/Page'
import { PlaygroundSessionV2, DisconnectInfo } from '@/features/PlaygroundSession'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
    onboardingActions,
    getOnboardingProductPath,
    getOnboardingPlaygroundCallCompleted,
    trackOnboardingEvent,
} from '@/features/Onboarding'
import { trackEvent } from '@/shared/config/analytics/initAnalytics'
import { toast } from 'react-toastify'
import { shouldRecordOnboardingCallSuccess } from '../../model/playgroundOnboardingGate'

interface PlaygroundPageProps {
    className?: string
}

const PlaygroundPage = memo((props: PlaygroundPageProps) => {
    const { className } = props
    const { t } = useTranslation('playground')
    const [searchParams, setSearchParams] = useSearchParams()
    const dispatch = useAppDispatch()

    const productPath = useSelector(getOnboardingProductPath)
    const playgroundCallCompleted = useSelector(getOnboardingPlaygroundCallCompleted)

    const onboardingFromUrl = searchParams.get('onboarding') === 'assistants'
    const preselectedAssistantId = searchParams.get('assistantId') ?? undefined

    const isOnboardingAssistants = useMemo(() => {
        if (playgroundCallCompleted) return false
        if (onboardingFromUrl) return true
        return productPath === 'assistants'
    }, [onboardingFromUrl, productPath, playgroundCallCompleted])

    const handleSessionDisconnect = useCallback((info: DisconnectInfo) => {
        if (!shouldRecordOnboardingCallSuccess(info, isOnboardingAssistants)) return

        dispatch(onboardingActions.setPlaygroundCallCompleted(true))
        trackOnboardingEvent('playground_call_success', { productPath: 'assistants' })
        trackEvent('first_call')
        dispatch(onboardingActions.resumeForPostSuccess())

        if (onboardingFromUrl) {
            setSearchParams({}, { replace: true })
        }

        toast.success(
            t('onboarding_call_success', 'Отлично! Звонок прошёл успешно - настройте публикацию ассистента.')
        )
    }, [dispatch, isOnboardingAssistants, onboardingFromUrl, setSearchParams, t])

    return (
        <Page data-testid={'PlaygroundPage'} className={classNames(cls.Playground, {}, [className])}>
            <PlaygroundSessionV2
                preselectedAssistantId={preselectedAssistantId}
                onSessionDisconnect={handleSessionDisconnect}
                secondaryChrome={isOnboardingAssistants}
            />
        </Page>
    )
})

export default PlaygroundPage
