import { memo, useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { useAdminTopUp } from '@/entities/User/api/usersApi'
import { ClientSelect } from '@/entities/User/ui/ClientSelect/ClientSelect'
import { CurrencySelect } from '@/entities/User/ui/CurrencySelect/CurrencySelect'
import { UserCurrencyValues } from '@/entities/User/model/consts/consts'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Wallet } from 'lucide-react'
import { toast } from 'react-toastify'

interface AdminTopUpModalProps {
    className?: string
    isOpen: boolean
    onClose: () => void
    userId?: string
    userName?: string
}

export const AdminTopUpModal = memo((props: AdminTopUpModalProps) => {
    const { className, isOpen, onClose, userId, userName } = props
    const { t } = useTranslation('users')
    const [adminTopUp, { isLoading }] = useAdminTopUp()

    const [selectedUserId, setSelectedUserId] = useState('')
    const [amount, setAmount] = useState('')
    const [currency, setCurrency] = useState<UserCurrencyValues>(UserCurrencyValues.USD)
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
    const [paymentInfo, setPaymentInfo] = useState('')

    useEffect(() => {
        if (isOpen && userId) {
            setSelectedUserId(userId)
        }
        if (!isOpen) {
            setAmount('')
            setPaymentInfo('')
            setPaymentMethod('bank_transfer')
        }
    }, [isOpen, userId])

    const handleClientChange = useCallback((clientId: string) => {
        setSelectedUserId(clientId)
    }, [])

    const handleCurrencyChange = useCallback((_: any, value: UserCurrencyValues) => {
        setCurrency(value)
    }, [])

    const handleSubmit = useCallback(async () => {
        try {
            const numAmount = parseFloat(amount)
            if (isNaN(numAmount) || numAmount <= 0) return

            await adminTopUp({
                userId: selectedUserId,
                amount: numAmount,
                currency,
                paymentMethod,
                paymentInfo: paymentInfo || undefined
            }).unwrap()

            toast.success(t('Баланс успешно пополнен'))
            onClose()
        } catch (e) {
            toast.error(t('Ошибка пополнения'))
            console.error(e)
        }
    }, [adminTopUp, selectedUserId, amount, currency, paymentMethod, paymentInfo, onClose, t])

    const isValid = selectedUserId && amount && parseFloat(amount) > 0 && paymentMethod

    return (
        <Modal
            className={classNames('', {}, [className])}
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

                <ClientSelect
                    label={t('Клиент') || ''}
                    clientId={selectedUserId}
                    onChangeClient={handleClientChange}
                    size="small"
                />

                <Textarea
                    label={t('Сумма') || ''}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isLoading}
                    minRows={1}
                    type="number"
                />

                <CurrencySelect
                    value={currency}
                    onChange={handleCurrencyChange}
                    label={t('Валюта') || ''}
                />

                <Textarea
                    label={t('Метод оплаты') || ''}
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={isLoading}
                    minRows={1}
                />

                <Textarea
                    label={t('Описание') || ''}
                    value={paymentInfo}
                    onChange={(e) => setPaymentInfo(e.target.value)}
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
                        onClick={handleSubmit}
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
