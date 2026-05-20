import { memo, useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { useAdminTopUp, CurrencySelect, UserCurrencyValues } from '@/entities/User'
import { usePublicPrices } from '@/entities/Price'

import { classNames } from '@/shared/lib/classNames/classNames'
import { Wallet } from 'lucide-react'
import { toast } from 'react-toastify'
import cls from './AdminTopUpModal.module.scss'

interface AdminTopUpModalProps {
    className?: string
    isOpen: boolean
    onClose: () => void
    userId?: string
    userName?: string
}

/** Баланс в БД — USD; публичные цены: цена_в_валюте = цена_usd * rate ⇒ usd = сумма_в_валюте / rate */
function amountInInputCurrencyToUsd(amount: number, currency: UserCurrencyValues, rateFromApi: number): number {
    if (currency === UserCurrencyValues.USD) {
        return Math.round(amount * 100) / 100
    }
    const r = rateFromApi > 0 ? rateFromApi : 1
    return Math.round((amount / r) * 10000) / 10000
}

export const AdminTopUpModal = memo((props: AdminTopUpModalProps) => {
    const { className, isOpen, onClose, userId, userName } = props
    const { t } = useTranslation('users')
    const [adminTopUp, { isLoading }] = useAdminTopUp()

    const [amount, setAmount] = useState('')
    const [currency, setCurrency] = useState<UserCurrencyValues>(UserCurrencyValues.USD)
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
    const [paymentInfo, setPaymentInfo] = useState('')

    const skipRates = !isOpen || currency === UserCurrencyValues.USD
    const { data: priceInfo, isFetching: isRateLoading, isError: isRateError } = usePublicPrices(currency, {
        skip: skipRates,
    })

    const rate = currency === UserCurrencyValues.USD ? 1 : (priceInfo?.rate ?? 0)
    const rateReady = currency === UserCurrencyValues.USD || (priceInfo != null && rate > 0)

    const amountUsd = useMemo(() => {
        const numAmount = parseFloat(amount.replace(',', '.'))
        if (Number.isNaN(numAmount) || numAmount <= 0) return null
        if (!rateReady) return null
        return amountInInputCurrencyToUsd(numAmount, currency, rate)
    }, [amount, currency, rate, rateReady])

    useEffect(() => {
        if (!isOpen) {
            setAmount('')
            setPaymentInfo('')
            setPaymentMethod('bank_transfer')
            setCurrency(UserCurrencyValues.USD)
        }
    }, [isOpen])

    const handleCurrencyChange = useCallback((_: unknown, value: UserCurrencyValues) => {
        setCurrency(value)
    }, [])

    const handleSubmit = useCallback(async () => {
        try {
            const numAmount = parseFloat(amount.replace(',', '.'))
            if (Number.isNaN(numAmount) || numAmount <= 0) return
            if (amountUsd == null || amountUsd <= 0) return

            const extra =
                currency !== UserCurrencyValues.USD
                    ? ` (${String(numAmount)} ${currency} → ${String(amountUsd)} USD)`
                    : ''

            await adminTopUp({
                userId: String(userId),
                amount: amountUsd,
                currency: 'USD',
                paymentMethod,
                paymentInfo: [paymentInfo?.trim(), extra.trim()].filter(Boolean).join(' — ') || undefined,
            }).unwrap()

            toast.success(t('Баланс успешно пополнен'))
            onClose()
        } catch (e) {
            console.error(e)
        }
    }, [adminTopUp, userId, amount, amountUsd, currency, paymentMethod, paymentInfo, onClose, t])

    const isValid =
        userId &&
        amount &&
        parseFloat(amount.replace(',', '.')) > 0 &&
        paymentMethod &&
        rateReady &&
        amountUsd != null &&
        amountUsd > 0

    return (
        <Modal
            className={classNames(cls.AdminTopUpModal, {}, [className])}
            isOpen={isOpen}
            onClose={onClose}
        >
            <VStack gap="16" max>
                <HStack gap="8" align="center">
                    <Wallet size={22} />
                    <Text
                        title={t('Пополнить баланс')}
                        bold
                    />
                </HStack>

                {userName && (
                    <Text text={`${t('Пользователь')}: ${userName}`} variant="accent" />
                )}

                <Text text={t('Пополнение USD подсказка')} size="s" variant="accent" />

                <Textarea
                    label={t('Сумма') || ''}
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value) }}
                    disabled={isLoading}
                    minRows={1}
                    type="number"
                />

                <CurrencySelect
                    value={currency}
                    onChange={handleCurrencyChange}
                    label={t('Валюта') || ''}
                />

                {currency !== UserCurrencyValues.USD && isRateLoading && (
                    <Text text={t('Загрузка курса')} size="s" variant="accent" />
                )}

                {currency !== UserCurrencyValues.USD && !isRateLoading && !rateReady && (
                    <Text
                        text={isRateError ? t('Ошибка загрузки курса') : t('Курс недоступен')}
                        size="s"
                        variant="error"
                    />
                )}

                {amountUsd != null && amountUsd > 0 && (
                    <Text
                        text={t('На баланс зачисление USD', {
                            amount: amountUsd.toFixed(2),
                            currency: 'USD',
                        })}
                        size="s"
                    />
                )}

                <Textarea
                    label={t('Метод оплаты') || ''}
                    value={paymentMethod}
                    onChange={(e) => { setPaymentMethod(e.target.value) }}
                    disabled={isLoading}
                    minRows={1}
                />

                <Textarea
                    label={t('Описание') || ''}
                    value={paymentInfo}
                    onChange={(e) => { setPaymentInfo(e.target.value) }}
                    disabled={isLoading}
                    minRows={2}
                />

                <HStack gap="8" max justify="end">
                    <Button
                        onClick={onClose}
                        variant="clear"
                    >
                        {t('Отмена')}
                    </Button>
                    <Button
                        onClick={() => { void handleSubmit() }}
                        disabled={isLoading || !isValid}
                        variant="glass-action"
                    >
                        {t('Пополнить')}
                    </Button>
                </HStack>
            </VStack>
        </Modal>
    )
})
