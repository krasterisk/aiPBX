import { memo, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Brain, Wrench, Globe, Mic, Plug, BarChart3,
    Stethoscope, Headphones, UtensilsCrossed, Building2,
    Phone, Monitor, Server,
    CheckCircle2, Play, Square
} from 'lucide-react'
import {
    getRouteSignup,
    getRouteMain,
    getRoutePublicSpeechAnalytics,
    getRoutePublicPricing
} from '@/shared/const/router'
import cls from '../../shared/LandingStyles.module.scss'

const assistantFormImg = '/assets/landing/assistant-form.png'
const assistantPlaygroundImg = '/assets/landing/assistant-playground.png'
const assistantSipTrunkImg = '/assets/landing/assistant-sip-trunk.png'
const assistantChannelsImg = '/assets/landing/assistant-channels.png'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
}

const FEATURES = [
    { icon: Brain, titleKey: 'NLU', descKey: 'NLUDesc' },
    { icon: Wrench, titleKey: 'FunctionCalling', descKey: 'FunctionCallingDesc' },
    { icon: Globe, titleKey: 'MultiLang', descKey: 'MultiLangDesc' },
    { icon: Mic, titleKey: 'PremiumVoices', descKey: 'PremiumVoicesDesc' },
    { icon: Plug, titleKey: 'MCP', descKey: 'MCPDesc' },
    { icon: BarChart3, titleKey: 'AutoAnalytics', descKey: 'AutoAnalyticsDesc' },
]

const USE_CASES = [
    { icon: Stethoscope, titleKey: 'CaseClinic', descKey: 'CaseClinicDesc' },
    { icon: Headphones, titleKey: 'CaseSupport', descKey: 'CaseSupportDesc' },
    { icon: UtensilsCrossed, titleKey: 'CaseDelivery', descKey: 'CaseDeliveryDesc' },
    { icon: Building2, titleKey: 'CaseHotel', descKey: 'CaseHotelDesc' },
]

const VoiceAssistantsLandingPage = () => {
    const { t } = useTranslation('main')
    const audioRef = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    const handlePlayStop = useCallback(() => {
        const audio = audioRef.current
        if (!audio) return
        if (isPlaying) {
            audio.pause()
            audio.currentTime = 0
            setIsPlaying(false)
        } else {
            audio.play()
            setIsPlaying(true)
        }
    }, [isPlaying])

    // Reset state when audio ends
    const handleAudioEnded = useCallback(() => { setIsPlaying(false) }, [])

    return (
        <div className={cls.LandingPage}>
            {/* ── Nav ── */}
            <nav className={cls.nav}>
                <Link to={getRouteMain()} className={cls.navLink}>
                    {/* eslint-disable-next-line i18next/no-literal-string */}
                    {'← AI PBX'}
                </Link>
                <div className={cls.navLinks}>
                    <Link to={getRoutePublicSpeechAnalytics()} className={cls.navLink}>
                        {t('VoiceAssistantsPage.NavAnalytics')}
                    </Link>
                    <Link to={getRoutePublicPricing()} className={cls.navLink}>
                        {t('Pricing')}
                    </Link>
                    <Link to={getRouteSignup()} className={cls.ctaBtn} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                        {t('VoiceAssistantsPage.NavStart')}
                    </Link>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className={`${cls.hero} ${cls.section}`}>
                <div className={cls.container}>
                    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                        <div className={cls.badge} style={{ marginBottom: 24 }}>
                            {t('VoiceAssistantsPage.HeroBadge')}
                        </div>
                        <h1 className={cls.heroTitle}>
                            {t('VoiceAssistantsPage.HeroTitle')}
                        </h1>
                        <p className={cls.heroSubtitle}>
                            {t('VoiceAssistantsPage.HeroSubtitle')}
                        </p>
                        <div className={cls.ctaGroup}>
                            <Link to={getRouteSignup()} className={cls.ctaBtn}>
                                {t('VoiceAssistantsPage.HeroCTA')}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Step 1: Create Assistant ── */}
            <section className={cls.section}>
                <div className={cls.container}>
                    <div className={cls.sectionHeader}>
                        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            {t('VoiceAssistantsPage.CreateTitle')}
                        </motion.h2>
                        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            {t('VoiceAssistantsPage.CreateSubtitle')}
                        </motion.p>
                    </div>
                    <div className={cls.steps}>
                        {/* Step 1: Prompt */}
                        <motion.div className={cls.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <div className={cls.stepContent}>
                                {/* eslint-disable-next-line i18next/no-literal-string */}
                                <div className={cls.stepNumber}>01</div>
                                <div className={cls.stepTitle}>{t('VoiceAssistantsPage.Step1Title')}</div>
                                <div className={cls.stepDesc}>{t('VoiceAssistantsPage.Step1Desc')}</div>
                            </div>
                            <div className={cls.stepImage}>
                                <img src={assistantFormImg} alt="Assistant Form" className={cls.screenshot} loading="lazy" />
                            </div>
                        </motion.div>

                        {/* Step 2: Test in Playground */}
                        <motion.div className={cls.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <div className={cls.stepContent}>
                                {/* eslint-disable-next-line i18next/no-literal-string */}
                                <div className={cls.stepNumber}>02</div>
                                <div className={cls.stepTitle}>{t('VoiceAssistantsPage.Step2Title')}</div>
                                <div className={cls.stepDesc}>{t('VoiceAssistantsPage.Step2Desc')}</div>
                            </div>
                            <div className={cls.stepImage}>
                                <img src={assistantPlaygroundImg} alt="Playground" className={cls.screenshot} loading="lazy" />
                            </div>
                        </motion.div>

                        {/* Step 3: Connect Telephony */}
                        <motion.div className={cls.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <div className={cls.stepContent}>
                                {/* eslint-disable-next-line i18next/no-literal-string */}
                                <div className={cls.stepNumber}>03</div>
                                <div className={cls.stepTitle}>{t('VoiceAssistantsPage.Step3Title')}</div>
                                <div className={cls.stepDesc}>{t('VoiceAssistantsPage.Step3Desc')}</div>
                            </div>
                            <div className={cls.stepImage}>
                                <img src={assistantSipTrunkImg} alt="SIP Trunk" className={cls.screenshot} loading="lazy" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Listen to Sample Call ── */}
            <section className={cls.section}>
                <div className={cls.container}>
                    <div className={cls.sectionHeader}>
                        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            {t('VoiceAssistantsPage.DialogTitle')}
                        </motion.h2>
                        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            {t('VoiceAssistantsPage.DialogSubtitle')}
                        </motion.p>
                    </div>
                    <motion.div
                        className={cls.audioPlayer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        style={{ maxWidth: 600, margin: '0 auto' }}
                    >
                        <div className={cls.glassCard} style={{ padding: '32px', textAlign: 'center' }}>
                            <div style={{ marginBottom: 16, color: 'var(--accent-redesigned)' }}>
                                <Headphones size={48} strokeWidth={1.5} />
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>
                                {t('VoiceAssistantsPage.AudioLabel')}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: 24 }}>
                                {t('VoiceAssistantsPage.AudioDesc')}
                            </div>
                            <button
                                type="button"
                                onClick={handlePlayStop}
                                className={cls.playBtn}
                                aria-label={isPlaying ? 'Stop' : 'Play'}
                            >
                                {isPlaying ? <Square size={28} /> : <Play size={28} style={{ marginLeft: 3 }} />}
                            </button>
                            <audio ref={audioRef} src="/assets/landing/sample-call.mp3" preload="none" onEnded={handleAudioEnded} />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Features Grid ── */}
            <section className={cls.section}>
                <div className={cls.container}>
                    <div className={cls.sectionHeader}>
                        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            {t('VoiceAssistantsPage.FeaturesTitle')}
                        </motion.h2>
                    </div>
                    <motion.div
                        className={cls.featureGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        {FEATURES.map((f) => (
                            <div className={cls.glassCard} key={f.titleKey}>
                                <div className={cls.featureIcon}><f.icon size={24} /></div>
                                <div className={cls.featureTitle}>{t(`VoiceAssistantsPage.Feature_${f.titleKey}`)}</div>
                                <div className={cls.featureDesc}>{t(`VoiceAssistantsPage.Feature_${f.descKey}`)}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── SIP Trunks — Any PBX ── */}
            <section className={cls.section}>
                <div className={cls.container}>
                    <div className={cls.twoCol}>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>
                                {t('VoiceAssistantsPage.SipTitle')}
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 20 }}>
                                {t('VoiceAssistantsPage.SipDesc')}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div className={cls.glassCard} style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                                        <span>{t('VoiceAssistantsPage.SipFeature1')}</span>
                                    </div>
                                </div>
                                <div className={cls.glassCard} style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                                        <span>{t('VoiceAssistantsPage.SipFeature2')}</span>
                                    </div>
                                </div>
                                <div className={cls.glassCard} style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                                        <span>{t('VoiceAssistantsPage.SipFeature3')}</span>
                                    </div>
                                </div>
                                <div className={cls.glassCard} style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                                        <span>{t('VoiceAssistantsPage.SipFeature4')}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                            <img src={assistantSipTrunkImg} alt="SIP Trunk" className={cls.screenshot} loading="lazy" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Channels ── */}
            <section className={cls.section}>
                <div className={cls.container}>
                    <div className={cls.sectionHeader}>
                        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            {t('VoiceAssistantsPage.ChannelsTitle')}
                        </motion.h2>
                        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            {t('VoiceAssistantsPage.ChannelsSubtitle')}
                        </motion.p>
                    </div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <img src={assistantChannelsImg} alt="Channels" className={`${cls.screenshot} ${cls.screenshotSmall}`} loading="lazy" />
                    </motion.div>
                    <motion.div
                        className={cls.channelGrid}
                        style={{ marginTop: 40 }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <div className={cls.channelCard}>
                            <div className={cls.channelIcon}><Phone size={32} /></div>
                            <div className={cls.channelTitle}>{t('VoiceAssistantsPage.Channel1Title')}</div>
                            <div className={cls.channelDesc}>{t('VoiceAssistantsPage.Channel1Desc')}</div>
                        </div>
                        <div className={cls.channelCard}>
                            <div className={cls.channelIcon}><Monitor size={32} /></div>
                            <div className={cls.channelTitle}>{t('VoiceAssistantsPage.Channel2Title')}</div>
                            <div className={cls.channelDesc}>{t('VoiceAssistantsPage.Channel2Desc')}</div>
                        </div>
                        <div className={cls.channelCard}>
                            <div className={cls.channelIcon}><Server size={32} /></div>
                            <div className={cls.channelTitle}>{t('VoiceAssistantsPage.Channel3Title')}</div>
                            <div className={cls.channelDesc}>{t('VoiceAssistantsPage.Channel3Desc')}</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Use Cases ── */}
            <section className={cls.section}>
                <div className={cls.container}>
                    <div className={cls.sectionHeader}>
                        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            {t('VoiceAssistantsPage.UseCasesTitle')}
                        </motion.h2>
                    </div>
                    <motion.div
                        className={cls.featureGrid}
                        style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        {USE_CASES.map((uc) => (
                            <div className={cls.glassCard} key={uc.titleKey}>
                                <div className={cls.featureIcon}><uc.icon size={24} /></div>
                                <div className={cls.featureTitle}>{t(`VoiceAssistantsPage.${uc.titleKey}`)}</div>
                                <div className={cls.featureDesc}>{t(`VoiceAssistantsPage.${uc.descKey}`)}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className={cls.section}>
                <div className={cls.container}>
                    <motion.div className={cls.ctaSection} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <div className={cls.ctaTitle}>{t('VoiceAssistantsPage.CTATitle')}</div>
                        <div className={cls.ctaDesc}>{t('VoiceAssistantsPage.CTADesc')}</div>
                        <Link to={getRouteSignup()} className={cls.ctaBtn}>
                            {t('VoiceAssistantsPage.CTAButton')}
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default memo(VoiceAssistantsLandingPage)
