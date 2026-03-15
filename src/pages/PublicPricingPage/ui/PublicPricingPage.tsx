import React, { FC, memo, useCallback, useMemo, useState } from 'react'
import { Page } from '@/widgets/Page'
import cls from './PublicPricingPage.module.scss'
import { useTranslation } from 'react-i18next'
import { Container, Typography, useMediaQuery } from '@mui/material'
import { motion } from 'framer-motion'
import {
  Phone,
  MessageSquareText,
  BarChart3,
  Mic,
  ArrowRight,
  ArrowLeft,
  Check,
  HelpCircle,
  Zap,
} from 'lucide-react'
import { LangSwitcher } from '@/entities/LangSwitcher'
import { useNavigate } from 'react-router-dom'
import { getRouteMain, getRouteSignup } from '@/shared/const/router'
import { usePublicPrices } from '@/entities/Price'
import { Button } from '@/shared/ui/redesigned/Button'
import LogoIcon from '@/shared/assets/icons/aipbx_logo_v3.svg'
import { getDomainConfig } from '@/shared/lib/domain'

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut' }
}

type Currency = 'USD' | 'RUB' | 'EUR' | 'CNY'

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  RUB: '₽',
  EUR: '€',
  CNY: '¥',
}

const PublicPricingPage: FC = memo(() => {
  const { t, i18n } = useTranslation('pricing')
  const isMobile = useMediaQuery('(max-width:768px)')
  const navigate = useNavigate()
  const isRuDomain = getDomainConfig().region === 'ru'

  // Available currencies depend on domain
  const availableCurrencies = useMemo<Currency[]>(() => {
    if (isRuDomain) return ['RUB']
    return ['USD', 'EUR', 'CNY']
  }, [isRuDomain])

  // Determine default currency
  const defaultCurrency = useMemo<Currency>(() => {
    if (isRuDomain) return 'RUB'
    const lang = i18n.language?.split('-')[0]
    if (lang === 'de') return 'EUR'
    if (lang === 'zh') return 'CNY'
    return 'USD'
  }, [i18n.language, isRuDomain])

  const [currency, setCurrency] = useState<Currency>(defaultCurrency)
  const { data: prices, isLoading, isError } = usePublicPrices(currency)

  const symbol = CURRENCY_SYMBOLS[currency]

  const formatPrice = useCallback((value: number | undefined) => {
    if (value === undefined) return '—'
    // Show 2 decimal places for small values, none for large
    if (value < 1) return value.toFixed(3)
    if (value < 100) return value.toFixed(2)
    return value.toFixed(1)
  }, [])

  const onBack = useCallback(() => {
    navigate(getRouteMain())
  }, [navigate])

  const onRegister = useCallback(() => {
    navigate(getRouteSignup())
  }, [navigate])

  const services = useMemo(() => [
    {
      key: 'realtime' as const,
      icon: Phone,
      highlight: true,
    },
    {
      key: 'text' as const,
      icon: MessageSquareText,
      highlight: false,
    },
    {
      key: 'analytic' as const,
      icon: BarChart3,
      highlight: false,
    },
    {
      key: 'stt' as const,
      icon: Mic,
      highlight: false,
      promo: true,
    },
  ], [])

  return (
    <Page data-testid="PublicPricingPage" className={cls.PricingPage}>
      {/* Navigation */}
      <div className={cls.nav}>
        <Button variant="glass-action" onClick={onBack}>
          <ArrowLeft size={18} style={{ marginRight: 6 }} />
          {t('BackToMain')}
        </Button>
      </div>
      {getDomainConfig().region !== 'ru' && (
        <div className={cls.lang}>
          <LangSwitcher short={isMobile} />
        </div>
      )}

      {/* Hero Section */}
      <section className={`${cls.section} ${cls.hero}`}>
        <div className={cls.glow} style={{ top: '-10%', left: '30%' }} />
        <Container maxWidth="lg" className={cls.heroContent}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
          >
            <div style={{ marginBottom: 24, cursor: 'pointer' }} onClick={onBack}>
              <LogoIcon style={{ width: isMobile ? 80 : 100, height: 'auto' }} />
            </div>

            <Typography
              variant="h1"
              className={cls.title}
              align="center"
              sx={{
                fontSize: { xs: '2rem', sm: '2.8rem', md: '3.5rem' },
                mb: 2,
              }}
            >
              {t('Hero.Title')}
            </Typography>

            <Typography className={cls.subtitle} align="center">
              {t('Hero.SubTitle')}
            </Typography>

            {/* Currency Selector — hidden for RU domain (only RUB) */}
            {availableCurrencies.length > 1 && (
              <div className={cls.currencySelector}>
                {availableCurrencies.map((cur) => (
                  <button
                    key={cur}
                    className={`${cls.currencyBtn} ${currency === cur ? cls.currencyBtnActive : ''}`}
                    onClick={() => { setCurrency(cur) }}
                  >
                    {CURRENCY_SYMBOLS[cur]} {cur}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </Container>
      </section>

      {/* Price Cards */}
      <section className={cls.section}>
        <Container maxWidth="lg">
          {isLoading && (
            <div className={cls.loadingWrapper}>
              <div className={cls.spinner} />
              <p>{t('Loading')}</p>
            </div>
          )}

          {isError && (
            <div className={cls.errorWrapper}>
              <HelpCircle size={48} />
              <p>{t('Error')}</p>
            </div>
          )}

          {prices && (
            <>
              <div className={cls.priceGrid}>
                {services.map((service, idx) => (
                  <motion.div
                    key={service.key}
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    transition={{ ...fadeInUp.transition, delay: idx * 0.1 }}
                  >
                    <div className={`${cls.priceCard} ${service.highlight ? cls.priceCardHighlight : ''}`}>
                      {service.promo && <div className={cls.promoRibbon}>PROMO</div>}
                      <div className={cls.cardIcon}>
                        <service.icon size={28} />
                      </div>
                      <span className={cls.cardLabel}>
                        {t(`Services.${service.key}.Label`)}
                      </span>
                      <h3 className={cls.cardTitle}>
                        {t(`Services.${service.key}.Title`)}
                      </h3>
                      <div className={cls.priceValue}>
                        {service.promo ? (
                          <>
                            <span className={cls.priceOld}>
                              {symbol}{formatPrice(prices[service.key])}
                            </span>
                            <span className={cls.priceFree}>FREE</span>
                          </>
                        ) : (
                          <>
                            <span className={cls.priceAmount}>
                              {symbol}{formatPrice(prices[service.key])}
                            </span>
                            <span className={cls.priceUnit}>
                              / {t(`Services.${service.key}.Unit`)}
                            </span>
                          </>
                        )}
                      </div>
                      {service.promo && (
                        <span className={cls.promoBadge}>
                          <Zap size={14} />
                          {t('PromoLabel', { defaultValue: 'Limited offer' })}
                        </span>
                      )}
                      <p className={cls.cardDesc}>
                        {t(`Services.${service.key}.Desc`)}
                      </p>
                      <ul className={cls.featureList}>
                        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion */}
                        {(t(`Services.${service.key}.Features`, { returnObjects: true }) as string[]).map(
                          (feature: string, fIdx: number) => (
                            <li key={fIdx} className={cls.featureItem}>
                              <Check size={16} />
                              <span>{feature}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>

              {prices.rate && prices.rate !== 1 && (
                <p className={cls.rateNote}>
                  {t('RateNote', { rate: prices.rate, currency: prices.currency })}
                </p>
              )}
            </>
          )}
        </Container>
      </section>

      {/* Detailed table */}
      <section className={cls.section} style={{ background: 'rgba(255,255,255,0.02)' }}>
        <Container maxWidth="lg">
          <div className={cls.sectionHeader}>
            <motion.h2 {...fadeInUp}>{t('DetailedTable.Title')}</motion.h2>
            <motion.p {...fadeInUp}>{t('DetailedTable.SubTitle')}</motion.p>
          </div>

          {prices && (
            <motion.div
              className={cls.tableWrapper}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <table className={cls.pricingTable}>
                <thead>
                  <tr>
                    <th>{t('Table.Service')}</th>
                    <th>{t('Table.Price')}</th>
                    <th>{t('Table.Unit')}</th>
                    <th>{t('Table.Description')}</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.key}>
                      <td className={cls.serviceName}>
                        <service.icon size={18} />
                        {t(`Services.${service.key}.Title`)}
                      </td>
                      <td className={cls.priceCell}>
                        {service.promo ? (
                          <>
                            <span className={cls.tablePriceOld}>
                              {symbol}{formatPrice(prices[service.key])}
                            </span>
                            <span className={cls.tablePriceFree}>FREE</span>
                          </>
                        ) : (
                          <>{symbol}{formatPrice(prices[service.key])}</>
                        )}
                      </td>
                      <td className={cls.unitCell}>
                        {t(`Services.${service.key}.UnitFull`)}
                      </td>
                      <td>{t(`Services.${service.key}.TableDesc`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </Container>
      </section>

      {/* FAQ Section */}
      <section className={cls.section}>
        <Container maxWidth="lg">
          <div className={cls.sectionHeader}>
            <motion.h2 {...fadeInUp}>{t('FAQ.Title')}</motion.h2>
          </div>

          <div className={cls.faqGrid}>
            {[1, 2, 3, 4].map((num) => (
              <motion.div
                key={num}
                className={cls.faqCard}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                transition={{ ...fadeInUp.transition, delay: num * 0.1 }}
              >
                <h3>{t(`FAQ.Q${num}.Question`)}</h3>
                <p>{t(`FAQ.Q${num}.Answer`)}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className={cls.section}>
        <Container maxWidth="lg">
          <motion.div
            className={cls.ctaSection}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.5rem' }}>
              {t('CTA.Title')}
            </h2>
            <p style={{ fontSize: '1.15rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
              {t('CTA.SubTitle')}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                size="xl"
                variant="glass-action"
                onClick={onRegister}
              >
                {t('CTA.Button')}
                <ArrowRight size={20} style={{ marginLeft: 8 }} />
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      <footer style={{ padding: '40px 0', borderTop: 'var(--glass-border-subtle)', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
        <Container maxWidth="lg">
          <Typography variant="body2">
            {t('Footer', { year: new Date().getFullYear() })}
          </Typography>
        </Container>
      </footer>
    </Page>
  )
})

export default PublicPricingPage
