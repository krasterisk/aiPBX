import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Page } from '@/widgets/Page'
import { getRouteLegal } from '@/shared/const/router'
import cls from '../LegalPage/LegalPage.module.scss'

const LiabilityDisclaimerPage = memo(() => {
    const { t } = useTranslation('legal')

    return (
        <Page data-testid="LiabilityDisclaimerPage">
            <div className={cls.legalContent}>
                <Link to={getRouteLegal()} className={cls.backLink}>
                    ← {t('Back to Legal')}
                </Link>
                <h1 className={cls.contentTitle}>{t('Liability Disclaimer')}</h1>
                <p className={cls.lastUpdated}>{t('Last updated')}: 2026-02-13</p>

                <div className={cls.section}>
                    <h2 className={cls.sectionTitle}>{t('1. General Disclaimer')}</h2>
                    <p className={cls.text}>
                        {t('liability_general_text')}
                    </p>
                </div>

                <div className={cls.section}>
                    <h2 className={cls.sectionTitle}>{t('2. Limitation of Liability')}</h2>
                    <p className={cls.text}>
                        {t('liability_limitation_text')}
                    </p>
                </div>

                <div className={cls.section}>
                    <h2 className={cls.sectionTitle}>{t('3. No Warranty')}</h2>
                    <p className={cls.text}>
                        {t('liability_warranty_text')}
                    </p>
                </div>

                <div className={cls.section}>
                    <h2 className={cls.sectionTitle}>{t('4. Indemnification')}</h2>
                    <p className={cls.text}>
                        {t('liability_indemnification_text')}
                    </p>
                </div>

                <div className={cls.section}>
                    <h2 className={cls.sectionTitle}>{t('5. Force Majeure')}</h2>
                    <p className={cls.text}>
                        {t('liability_force_majeure_text')}
                    </p>
                </div>

                <div className={cls.section}>
                    <h2 className={cls.sectionTitle}>{t('6. Severability')}</h2>
                    <p className={cls.text}>
                        {t('liability_severability_text')}
                    </p>
                </div>
            </div>
        </Page>
    )
})

export default LiabilityDisclaimerPage
