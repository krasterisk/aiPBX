import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Page } from '@/widgets/Page'
import { getDomainConfig } from '@/shared/lib/domain'
import {
    getRouteLegalTerms,
    getRouteLegalPrivacy,
    getRouteLegalDpa,
    getRouteLegalPublicOffer,
    getRouteLegalPersonalData,
    getRouteLegalLiability
} from '@/shared/const/router'
import cls from './LegalPage.module.scss'

const LegalPage = memo(() => {
    const { t } = useTranslation('legal')
    const config = getDomainConfig()
    const isRuDomain = config.region === 'ru'

    const allPages = [
        {
            to: getRouteLegalTerms(),
            title: t('US Terms of Service'),
            description: t('Terms and conditions for using our services in the United States'),
            showForRu: false
        },
        {
            to: getRouteLegalPrivacy(),
            title: t('US Privacy Policy'),
            description: t('How we collect, use, and protect your personal information'),
            showForRu: false
        },
        {
            to: getRouteLegalDpa(),
            title: t('Data Processing Agreement'),
            description: t('Agreement governing the processing of personal data on behalf of clients'),
            showForRu: false
        },
        {
            to: getRouteLegalPublicOffer(),
            title: t('Публичная оферта (РФ)'),
            description: t('Conditions of the public offer for users in the Russian Federation'),
            showForRu: true
        },
        {
            to: getRouteLegalPersonalData(),
            title: t('Политика обработки персональных данных (РФ)'),
            description: t('Personal data processing policy in accordance with RF legislation'),
            showForRu: true
        },
        {
            to: getRouteLegalLiability(),
            title: t('Liability Disclaimer'),
            description: t('Universal limitations of liability and warranty disclaimers'),
            showForRu: false
        }
    ]

    const pages = allPages.filter(page => isRuDomain ? page.showForRu : !page.showForRu)

    return (
        <Page data-testid="LegalPage">
            <div className={cls.LegalPage}>
                <h1 className={cls.title}>{t('Legal & Policies')}</h1>
                <div className={cls.grid}>
                    {pages.map((page) => (
                        <Link key={page.to} to={page.to} className={cls.card}>
                            <span className={cls.cardTitle}>{page.title}</span>
                            <span className={cls.cardDescription}>{page.description}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </Page>
    )
})

export default LegalPage
