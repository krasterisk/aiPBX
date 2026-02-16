import React, { FC, memo, useCallback, useEffect } from 'react'
import { Page } from '@/widgets/Page'
import cls from './MainPage.module.scss'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Typography,
  Box,
  useMediaQuery
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  Brain,
  Wrench,
  BarChart3,
  Globe,
  DollarSign,
  UserX,
  MessageSquareOff,
  Phone,
  Settings,
  Link as LinkIcon,
  Rocket,
  Headphones,
  LineChart,
  Calendar,
  ShieldCheck,
  Eye,
  ArrowRight,
  Sparkles,
  UserPlus
} from 'lucide-react'
import { LangSwitcher } from '@/entities/LangSwitcher'
import { useNavigate } from 'react-router-dom'
import { getRouteDashboard, getRouteSignup, getRouteLogin } from '@/shared/const/router'
import { getUserAuthData } from '@/entities/User'
import { useSelector } from 'react-redux'
import { Button } from '@/shared/ui/redesigned/Button'
import LogoIcon from '@/shared/assets/icons/aipbx_logo_v3.svg'

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut' }
}

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  desc: string
  delay?: number
}

const FeatureCard: FC<FeatureCardProps> = ({ icon: Icon, title, desc, delay = 0 }) => (
  <motion.div
    variants={fadeInUp}
    initial="initial"
    whileInView="whileInView"
    viewport={{ once: true }}
    transition={{ ...fadeInUp.transition, delay }}
  >
    <div className={cls.card}>
      <div className={cls.iconWrapper}>
        <Icon size={28} />
      </div>
      <h3 className={cls.cardTitle}>{title}</h3>
      <p className={cls.cardDesc}>{desc}</p>
    </div>
  </motion.div>
)

const MainPage: FC = memo(() => {
  const { t } = useTranslation('main')
  const isMobile = useMediaQuery('(max-width:768px)')
  const navigate = useNavigate()
  const auth = useSelector(getUserAuthData)

  useEffect(() => {
    if (auth) {
      navigate(getRouteDashboard(), { replace: true })
    }
  }, [auth, navigate])

  const onRegister = useCallback(() => {
    navigate(getRouteSignup())
  }, [navigate])

  const onLogin = useCallback(() => {
    navigate(getRouteLogin())
  }, [navigate])

  return (
    <Page data-testid={'MainPage'} className={cls.MainPage}>
      <div className={cls.loginBtn}>
        <Button variant="glass-action" onClick={onLogin}>
          {t('Login')}
        </Button>
      </div>
      <div className={cls.lang}>
        <LangSwitcher short={isMobile} />
      </div>

      {/* Hero Section */}
      <section className={`${cls.section} ${cls.hero}`}>
        <div className={cls.glow} style={{ top: '-10%', left: '20%' }} />
        <Container maxWidth="lg" className={cls.heroContent}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className={cls.heroWrapper}
          >
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <LogoIcon style={{ width: isMobile ? 100 : 120, height: 'auto' }} />
            </Box>

            <Typography
              variant="h1"
              className={cls.title}
              align="center"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                mb: 4
              }}
            >
              {t('Hero.Title')}
            </Typography>

            <Typography className={cls.subtitle} align="center">
              {t('Hero.SubTitle')}
            </Typography>

            <div className={cls.ctaGroup} style={{ marginTop: 'var(--space-4)' }}>
              <Button
                color="accent"
                size="l"
                variant='glass-action'
                onClick={onRegister}
              >
                {t('Hero.CTA_Start')}
                <ArrowRight size={18} style={{ marginLeft: 8 }} />
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Problem Section */}
      <section className={cls.section}>
        <Container maxWidth="lg">
          <div className={cls.sectionHeader}>
            <motion.h2 {...fadeInUp}>{t('Problem.Title')}</motion.h2>
          </div>

          <div className={cls.grid}>
            <FeatureCard
              icon={DollarSign}
              title={t('Problem.Expensive.Title')}
              desc={t('Problem.Expensive.Desc')}
              delay={0.1}
            />
            <FeatureCard
              icon={UserX}
              title={t('Problem.HumanFactor.Title')}
              desc={t('Problem.HumanFactor.Desc')}
              delay={0.2}
            />
            <FeatureCard
              icon={MessageSquareOff}
              title={t('Problem.OldIVR.Title')}
              desc={t('Problem.OldIVR.Desc')}
              delay={0.3}
            />
          </div>
        </Container>
      </section>

      {/* Solution Section */}
      <section className={cls.section} style={{ background: 'rgba(255,255,255,0.02)' }}>
        <Container maxWidth="lg">
          <div className={cls.step}>
            <motion.div className={cls.stepContent} {...fadeInUp}>
              <h2 className={cls.solutionTitle}>
                {t('Solution.Title')}
              </h2>
              <p className={cls.solutionDesc}>
                {t('Solution.Desc')}
              </p>
            </motion.div>
            <motion.div
              className={cls.stepImage}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ height: isMobile ? '300px' : '400px' }}
            >
              <img
                src="/assets/hero-visual.png"
                alt="AI PBX Visual"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
              />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className={cls.section}>
        <Container maxWidth="lg">
          <div className={cls.sectionHeader}>
            <motion.h2 {...fadeInUp}>{t('HowItWorks.Title')}</motion.h2>
          </div>

          <div className={cls.steps}>
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className={cls.step}>
                <motion.div
                  className={cls.stepContent}
                  initial={{ opacity: 0, x: step % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className={cls.stepNumber}>0{step}</div>
                  <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
                    {t(`HowItWorks.Step${step}.Title`)}
                  </h3>
                  <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)' }}>
                    {t(`HowItWorks.Step${step}.Desc`)}
                  </p>
                </motion.div>
                <motion.div
                  className={cls.stepImage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={`/assets/how-it-works-${step}.png`}
                      alt={String(t(`HowItWorks.Step${step}.Title`))}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                    />
                  </Box>
                </motion.div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Grid */}
      <section className={cls.section} style={{ background: 'rgba(255,255,255,0.02)' }}>
        <Container maxWidth="lg">
          <div className={cls.sectionHeader}>
            <motion.h2 {...fadeInUp}>{t('Features.Title')}</motion.h2>
          </div>

          <div className={cls.grid}>
            <FeatureCard
              icon={Brain}
              title={t('Features.NLU.Title')}
              desc={t('Features.NLU.Desc')}
              delay={0.1}
            />
            <FeatureCard
              icon={Wrench}
              title={t('Features.ToolUse.Title')}
              desc={t('Features.ToolUse.Desc')}
              delay={0.2}
            />
            <FeatureCard
              icon={BarChart3}
              title={t('Features.Analytics.Title')}
              desc={t('Features.Analytics.Desc')}
              delay={0.3}
            />
            <FeatureCard
              icon={Globe}
              title={t('Features.WebRTC.Title')}
              desc={t('Features.WebRTC.Desc')}
              delay={0.4}
            />
            <FeatureCard
              icon={Wrench}
              title={t('Integrations.DevFriendly.Title')}
              desc={t('Integrations.DevFriendly.Desc')}
              delay={0.5}
            />
            <FeatureCard
              icon={Phone}
              title={t('Integrations.Asterisk.Title')}
              desc={t('Integrations.Asterisk.Desc')}
              delay={0.6}
            />
          </div>
        </Container>
      </section>

      {/* Cases Section */}
      <section className={cls.section}>
        <Container maxWidth="lg">
          <div className={cls.sectionHeader}>
            <motion.h2 {...fadeInUp}>{t('UseCases.Title')}</motion.h2>
          </div>

          <div className={cls.grid}>
            <div className={cls.card}>
              <Headphones size={40} color="var(--accent-redesigned)" />
              <h3 className={cls.cardTitle}>{t('UseCases.Support.Title')}</h3>
              <p className={cls.cardDesc}>{t('UseCases.Support.Desc')}</p>
            </div>
            <div className={cls.card}>
              <LineChart size={40} color="var(--accent-redesigned)" />
              <h3 className={cls.cardTitle}>{t('UseCases.Sales.Title')}</h3>
              <p className={cls.cardDesc}>{t('UseCases.Sales.Desc')}</p>
            </div>
            <div className={cls.card}>
              <Calendar size={40} color="var(--accent-redesigned)" />
              <h3 className={cls.cardTitle}>{t('UseCases.Booking.Title')}</h3>
              <p className={cls.cardDesc}>{t('UseCases.Booking.Desc')}</p>
            </div>
          </div>

          <div className={cls.tags}>
            <div className={cls.tag}>{t('Target.SMB')}</div>
            <div className={cls.tag}>{t('Target.Enterprise')}</div>
            <div className={cls.tag}>{t('Target.Integrators')}</div>
          </div>
        </Container>
      </section>

      {/* Security Section */}
      <section className={cls.section}>
        <Container maxWidth="lg">
          <div className={cls.grid} style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)' }}>
            <div className={cls.card}>
              <Eye size={32} color="var(--accent-redesigned)" />
              <h3 className={cls.cardTitle}>{t('Security.Transparency.Title')}</h3>
              <p className={cls.cardDesc}>{t('Security.Transparency.Desc')}</p>
            </div>
            <div className={cls.card}>
              <ShieldCheck size={32} color="var(--accent-redesigned)" />
              <h3 className={cls.cardTitle}>{t('Security.Safety.Title')}</h3>
              <p className={cls.cardDesc}>{t('Security.Safety.Desc')}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className={cls.section}>
        <Container maxWidth="lg">
          <motion.div
            className={cls.finalCta}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '2rem' }}>
              {t('FinalCTA.Title')}
            </h2>
            <p style={{ fontSize: '1.25rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem' }}>
              {t('FinalCTA.SubTitle')}
            </p>
            <Button
              color="accent"
              size="l"
              variant="glass-action"
              onClick={onRegister}
            >
              {t('FinalCTA.Button')}
              <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </Button>
          </motion.div>
        </Container>
      </section>

      <footer style={{ padding: '40px 0', borderTop: 'var(--glass-border-subtle)', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
        <Container maxWidth="lg">
          <Typography variant="body2">
            {t('Footer.Copyright', { year: new Date().getFullYear() })}
          </Typography>
        </Container>
      </footer>
    </Page>
  )
})

export default MainPage
