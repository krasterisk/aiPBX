import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle } from 'lucide-react'
import cls from './OAuthCallbackScreen.module.scss'

/**
 * Shown inside OAuth popup after redirect.
 * Auto-closes after a short delay; user can also click to close immediately.
 */
export const OAuthCallbackScreen = () => {
    const { t } = useTranslation('tools')
    const [countdown, setCountdown] = useState(3)

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    window.close()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <div className={cls.wrapper}>
            <div className={cls.card}>
                <div className={cls.iconWrapper}>
                    <CheckCircle size={48} className={cls.icon} />
                </div>
                <h2 className={cls.title}>
                    {t('oauth_success_title')}
                </h2>
                <p className={cls.subtitle}>
                    {t('oauth_success_subtitle')}
                </p>
                <button
                    className={cls.closeBtn}
                    onClick={() => window.close()}
                >
                    {t('oauth_close_window')} ({countdown})
                </button>
            </div>
        </div>
    )
}
