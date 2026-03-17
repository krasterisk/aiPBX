import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Radio, PackageCheck, Bell } from 'lucide-react'
import { getRouteSignup, getRouteMain, getRoutePublicVoiceAssistants, getRoutePublicPricing } from '@/shared/const/router'
import cls from '../../shared/LandingStyles.module.scss'

const analyticsUploadImg = '/assets/landing/analytics-upload.png'
const analyticsDashboardImg = '/assets/landing/analytics-dashboard.png'
const analyticsMetricsImg = '/assets/landing/analytics-metrics.png'
const analyticsReportImg = '/assets/landing/analytics-report.png'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
}

const METRICS = [
    { name: 'Качество приветствия', color: '#22c55e' },
    { name: 'Следование скрипту', color: '#f59e0b' },
    { name: 'Вежливость и эмпатия', color: '#22c55e' },
    { name: 'Активное слушание', color: '#f59e0b' },
    { name: 'Работа с возражениями', color: '#f59e0b' },
    { name: 'Знание продукта', color: '#22c55e' },
    { name: 'Решение проблемы', color: '#f59e0b' },
    { name: 'Темп речи', color: '#22c55e' },
    { name: 'Качество завершения', color: '#f59e0b' },
]

const SpeechAnalyticsLandingPage = () => {
    const { t } = useTranslation('main')

    return (
        <div className={cls.LandingPage}>
            {/* ── Nav ── */}
            <nav className={cls.nav}>
                <Link to={getRouteMain()} className={cls.navLink}>
                    {/* eslint-disable-next-line i18next/no-literal-string */}
                    {'← AI PBX'}
                </Link>
                <div className={cls.navLinks}>
                    <Link to={getRoutePublicVoiceAssistants()} className={cls.navLink}>
                        {t('SpeechAnalyticsPage.NavAssistants')}
                    </Link>
                    <Link to={getRoutePublicPricing()} className={cls.navLink}>
                        {t('Pricing')}
                    </Link>
                    <Link to={getRouteSignup()} className={cls.ctaBtn} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                        {t('SpeechAnalyticsPage.NavStart')}
                    </Link>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className={`${cls.hero} ${cls.section}`}>
                <div className={cls.container}>
                    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                        <div className={cls.badge} style={{ marginBottom: 24 }}>
                            {t('SpeechAnalyticsPage.HeroBadge')}
                        </div>
                        <h1 className={cls.heroTitle}>
                            {t('SpeechAnalyticsPage.HeroTitle')}
                        </h1>
                        <p className={cls.heroSubtitle}>
                            {t('SpeechAnalyticsPage.HeroSubtitle')}
                        </p>
                        <div className={cls.ctaGroup}>
                            <Link to={getRouteSignup()} className={cls.ctaBtn}>
                                {t('SpeechAnalyticsPage.HeroCTA')}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── How It Works (3 steps with screenshots) ── */}
            <section className={cls.section}>
                <div className={cls.container}>
                    <div className={cls.sectionHeader}>
                        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            {t('SpeechAnalyticsPage.HowTitle')}
                        </motion.h2>
                        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            {t('SpeechAnalyticsPage.HowSubtitle')}
                        </motion.p>
                    </div>
                    <div className={cls.steps}>
                        {/* Step 1: Upload */}
                        <motion.div className={cls.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <div className={cls.stepContent}>
                                {/* eslint-disable-next-line i18next/no-literal-string */}
                                <div className={cls.stepNumber}>01</div>
                                <div className={cls.stepTitle}>{t('SpeechAnalyticsPage.Step1Title')}</div>
                                <div className={cls.stepDesc}>{t('SpeechAnalyticsPage.Step1Desc')}</div>
                            </div>
                            <div className={cls.stepImage}>
                                <img src={analyticsUploadImg} alt="Upload" className={cls.screenshot} loading="lazy" />
                            </div>
                        </motion.div>

                        {/* Step 1b: API */}
                        <motion.div className={cls.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <div className={cls.stepContent}>
                                {/* eslint-disable-next-line i18next/no-literal-string */}
                                <div className={cls.stepNumber} style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>API</div>
                                <div className={cls.stepTitle}>{t('SpeechAnalyticsPage.Step1bTitle')}</div>
                                <div className={cls.stepDesc}>{t('SpeechAnalyticsPage.Step1bDesc')}</div>
                            </div>
                            <div className={cls.stepImage}>
                                <div className={cls.codeBlock} style={{ fontSize: '0.8rem' }}>
                                    <pre>{`curl -X POST /api/analyze-file \\
  -H "Authorization: Bearer TOKEN" \\
  -F "file=@call.mp3" \\
  -F "projectId=proj_abc"

# → webhook callback
{
  "status": "completed",
  "score": 82,
  "sentiment": "positive"
}`}</pre>
                                </div>
                            </div>
                        </motion.div>

                        {/* Step 2: Analysis */}
                        <motion.div className={cls.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <div className={cls.stepContent}>
                                {/* eslint-disable-next-line i18next/no-literal-string */}
                                <div className={cls.stepNumber}>02</div>
                                <div className={cls.stepTitle}>{t('SpeechAnalyticsPage.Step2Title')}</div>
                                <div className={cls.stepDesc}>{t('SpeechAnalyticsPage.Step2Desc')}</div>
                            </div>
                            <div className={cls.stepImage}>
                                <img src={analyticsReportImg} alt="Report" className={cls.screenshot} loading="lazy" />
                            </div>
                        </motion.div>

                        {/* Step 3: Dashboard */}
                        <motion.div className={cls.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <div className={cls.stepContent}>
                                {/* eslint-disable-next-line i18next/no-literal-string */}
                                <div className={cls.stepNumber}>03</div>
                                <div className={cls.stepTitle}>{t('SpeechAnalyticsPage.Step3Title')}</div>
                                <div className={cls.stepDesc}>{t('SpeechAnalyticsPage.Step3Desc')}</div>
                            </div>
                            <div className={cls.stepImage}>
                                <img src={analyticsDashboardImg} alt="Dashboard" className={cls.screenshot} loading="lazy" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Dashboard Showcase ── */}
            <section className={cls.section}>
                <div className={cls.container}>
                    <div className={cls.sectionHeader}>
                        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            {t('SpeechAnalyticsPage.DashboardTitle')}
                        </motion.h2>
                        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            {t('SpeechAnalyticsPage.DashboardSubtitle')}
                        </motion.p>
                    </div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <img src={analyticsDashboardImg} alt="Dashboard" className={cls.screenshot} loading="lazy" />
                    </motion.div>
                </div>
            </section>

            {/* ── 9 Metrics ── */}
            <section className={cls.section}>
                <div className={cls.container}>
                    <div className={cls.twoCol}>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>
                                {t('SpeechAnalyticsPage.MetricsTitle')}
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 24 }}>
                                {t('SpeechAnalyticsPage.MetricsDesc')}
                            </p>
                            <div className={cls.metricList} style={{ gridTemplateColumns: '1fr' }}>
                                {METRICS.map((m) => (
                                    <div className={cls.metricItem} key={m.name}>
                                        <div className={cls.metricDot} style={{ background: m.color }} />
                                        <div className={cls.metricName}>{t(`SpeechAnalyticsPage.Metric_${m.name}`, m.name)}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                            <img src={analyticsMetricsImg} alt="Metrics" className={cls.screenshot} loading="lazy" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── API Integration ── */}
            <section className={cls.section}>
                <div className={cls.container}>
                    <div className={cls.sectionHeader}>
                        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            {t('SpeechAnalyticsPage.ApiTitle')}
                        </motion.h2>
                        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            {t('SpeechAnalyticsPage.ApiSubtitle')}
                        </motion.p>
                    </div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <div className={cls.codeBlock}>
                            <pre>{`// Загрузка файла для анализа
curl -X POST https://aipbx.com/api/operator-analytics/analyze-file \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -F "file=@call_recording.mp3" \\
  -F "language=ru" \\
  -F "projectId=proj_abc123"

// Ответ
{
  "id": "analysis_12345",
  "status": "completed",
  "sentiment": "positive",
  "score": 82,
  "csat": 4.2,
  "summary": "Клиент записан на ремонт...",
  "metrics": {
    "greeting_quality": 85,
    "politeness_empathy": 91,
    "product_knowledge": 88
  }
}`}</pre>
                        </div>
                    </motion.div>
                    <motion.div
                        className={cls.featureGrid}
                        style={{ marginTop: 40 }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <div className={cls.glassCard}>
                            <div className={cls.featureIcon}><Radio size={24} /></div>
                            <div className={cls.featureTitle}>{t('SpeechAnalyticsPage.ApiFeature1Title')}</div>
                            <div className={cls.featureDesc}>{t('SpeechAnalyticsPage.ApiFeature1Desc')}</div>
                        </div>
                        <div className={cls.glassCard}>
                            <div className={cls.featureIcon}><PackageCheck size={24} /></div>
                            <div className={cls.featureTitle}>{t('SpeechAnalyticsPage.ApiFeature2Title')}</div>
                            <div className={cls.featureDesc}>{t('SpeechAnalyticsPage.ApiFeature2Desc')}</div>
                        </div>
                        <div className={cls.glassCard}>
                            <div className={cls.featureIcon}><Bell size={24} /></div>
                            <div className={cls.featureTitle}>{t('SpeechAnalyticsPage.ApiFeature3Title')}</div>
                            <div className={cls.featureDesc}>{t('SpeechAnalyticsPage.ApiFeature3Desc')}</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className={cls.section}>
                <div className={cls.container}>
                    <motion.div className={cls.ctaSection} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <div className={cls.ctaTitle}>{t('SpeechAnalyticsPage.CTATitle')}</div>
                        <div className={cls.ctaDesc}>{t('SpeechAnalyticsPage.CTADesc')}</div>
                        <Link to={getRouteSignup()} className={cls.ctaBtn}>
                            {t('SpeechAnalyticsPage.CTAButton')}
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default memo(SpeechAnalyticsLandingPage)
