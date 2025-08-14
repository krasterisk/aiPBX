import React, { FC, memo, useCallback, useEffect, useState } from 'react'
import { Page } from '@/widgets/Page'
import cls from './MainPage.module.scss'
import { useTranslation } from 'react-i18next'
import { Button, Card, CardContent, CardHeader, Typography, Box, Container, useMediaQuery } from '@mui/material'
import { motion } from 'framer-motion'
import {
  BrainCircuit,
  LogIn,
  Headphones,
  Zap,
  Database,
  Globe,
  Share2,
  Sparkles,
  LucideIcon
} from 'lucide-react'
import { LangSwitcher } from '@/entities/LangSwitcher'
import { LoginModal } from '@/features/AuthByUsername'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getUserAuthData } from '@/entities/User'
import { getRouteDashboard } from '@/shared/const/router'

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  desc: string
}

const FeatureCard: FC<FeatureCardProps> = ({ icon: Icon, title, desc }) => (
    <motion.div {...fadeInUp}>
        <Card sx={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          color: 'white'
        }}>
            <CardHeader avatar={<Icon size={28} />} title={<Typography variant="h6">{title}</Typography>} />
            <CardContent>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>{desc}</Typography>
            </CardContent>
        </Card>
    </motion.div>
)

const MainPage: FC = memo(() => {
  const { t } = useTranslation('main')
  const isMobile = useMediaQuery('(max-width:800px)')
  const [isAuthModal, setIsAuthModal] = useState(false)
  const userData = useSelector(getUserAuthData)

  const navigate = useNavigate()

  useEffect(() => {
    console.log('USERDATA: ', userData)
    if (userData) {
      navigate(getRouteDashboard())
    }
  }, [navigate, userData])

  const onShowModal = useCallback(() => {
    setIsAuthModal(true)
  }, [])

  const onCloseModal = useCallback(() => {
    setIsAuthModal(false)
  }, [])

  return (
        <Page data-testid={'MainPage'}>
            <Box sx={{ color: 'white', background: 'radial-gradient(circle at top, #1e293b, #0f172a)', minHeight: '100vh' }}>
                <LangSwitcher short={isMobile} className={cls.lang}/>
                <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                    <motion.div {...fadeInUp}>
                        <Typography variant="overline" display="block" gutterBottom>
                            <Sparkles size={48} style={{ verticalAlign: 'middle' }} /> {t('AI PBX — будущее бизнес‑телефонии')}
                        </Typography>
                        <Typography variant="h2" component="h1" gutterBottom>
                            {t('Создавайте голосовых ассистентов за минуты')}<br />
                            <Box component="span" sx={{ background: 'linear-gradient(to right, #f0abfc, #c084fc, #22d3ee)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                                {t('и автоматизируйте коммуникации')}
                            </Box>
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 800, mx: 'auto' }}>
                            {t('AI PBX заменяет колл‑центр и поддержку - звонки, заказы, интеграция с CRM и мессенджерами, аналитика и масштабируемость')}
                        </Typography>
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<LogIn />}
                                onClick={onShowModal}
                            >
                                {t('Войти')}
                            </Button>

                            {isAuthModal && (
                                <LoginModal
                                    isOpen={isAuthModal}
                                    onClose={onCloseModal}
                                />
                            )}
                        </Box>
                    </motion.div>
                </Container>

                <Container maxWidth="lg" sx={{ py: 8 }}>
                    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                        <FeatureCard icon={BrainCircuit} title={t('Нейро‑диалоги')} desc={t('LLM‑модель понимает намерения, контекст и действует как живой оператор')} />
                        <FeatureCard icon={Database} title={t('Подключение к данным')} desc={t('CRM, ERP, базы клиентов — мгновенный доступ к информации')} />
                        <FeatureCard icon={Share2} title={t('Омниканальность')} desc={t('Голос, WhatsApp, Telegram, веб‑чат — единый сценарий для всех каналов')} />
                        <FeatureCard icon={Headphones} title={t('Замена колл‑центра')} desc={t('Очереди, приоритеты, колл‑бек, перевод на оператора')} />
                        <FeatureCard icon={Zap} title={t('Автоматизация действий')} desc={t('Вызов функций - заказы, бронирования, платежи, статусы')} />
                        <FeatureCard icon={Globe} title={t('Масштаб и география')} desc={t('Многоязычие, локальные номера, аналитика и отчёты')} />
                    </Box>
                </Container>
            </Box>
        </Page>
  )
})

export default MainPage
