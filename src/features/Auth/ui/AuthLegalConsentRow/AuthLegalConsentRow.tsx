import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HStack } from '@/shared/ui/redesigned/Stack'
import {
    getAuthLegalConsentConfig,
    getAuthLegalConsentIntroKey,
} from '../../lib/getAuthLegalConsentLinks'
import cls from './AuthLegalConsentRow.module.scss'

interface AuthLegalConsentRowProps {
    id: string
    checked: boolean
    onChange: (checked: boolean) => void
    introTextKey: string
}

export const AuthLegalConsentRow = memo((props: AuthLegalConsentRowProps) => {
    const { id, checked, onChange, introTextKey } = props
    const { t } = useTranslation('login')
    const config = getAuthLegalConsentConfig()
    const intro = t(getAuthLegalConsentIntroKey(introTextKey))

    return (
        <HStack gap="8" align="start" className={cls.agreeRow}>
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(e) => { onChange(e.target.checked) }}
                className={cls.checkbox}
            />
            <label htmlFor={id} className={cls.agreeLabel}>
                {config.variant === 'ru'
                    ? (
                        <>
                            {intro}{' '}
                            <Link
                                to={config.links[0].to}
                                target="_blank"
                                className={cls.legalLink}
                                onClick={(e) => { e.stopPropagation() }}
                            >
                                {t(config.links[0].labelKey)}
                            </Link>{' '}
                            {t('и')}{' '}
                            <Link
                                to={config.links[1].to}
                                target="_blank"
                                className={cls.legalLink}
                                onClick={(e) => { e.stopPropagation() }}
                            >
                                {t(config.links[1].labelKey)}
                            </Link>
                        </>
                    )
                    : (
                        <>
                            {intro}{' '}
                            <Link
                                to={config.link.to}
                                target="_blank"
                                className={cls.legalLink}
                                onClick={(e) => { e.stopPropagation() }}
                            >
                                {t(config.link.labelKey)}
                            </Link>
                        </>
                    )}
            </label>
        </HStack>
    )
})
