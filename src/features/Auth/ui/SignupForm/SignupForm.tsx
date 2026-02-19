import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './SignupForm.module.scss'
import { useTranslation } from 'react-i18next'
import React, { memo, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Loader } from '@/shared/ui/Loader'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Button } from '@/shared/ui/redesigned/Button'
import { Divider } from '@/shared/ui/Divider'
import GoogleIcon from '@/shared/assets/icons/googleIcon.svg'
import TelegramIcon from '@mui/icons-material/Telegram'
import { useSignupData } from '../../lib/hooks/useSignupData'
import { getRouteLegal } from '@/shared/const/router'
import { Link } from 'react-router-dom'

interface SignupFormProps {
    className?: string
}

export const SignupForm = memo((props: SignupFormProps) => {
    const { className } = props
    const { t } = useTranslation('login')
    const [agreeTerms, setAgreeTerms] = useState(false)

    const {
        email,
        resendTimer,
        activationSignupCode,
        isSignupLoading,
        isGoogleLoading,
        isTelegramLoading,
        isSignupActivateLoading,
        isSignupActivation,
        signupError,
        onLogin,
        onChangeActivationCode,
        onSignupActivateClick,
        onTelegramSignupClick,
        onSignupClick,
        onChangeEmail,
        onGoogleSignupClick,
    } = useSignupData()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (isSignupActivation) {
            onSignupActivateClick()
        } else {
            onSignupClick()
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()

            if (isSignupActivation) {
                onSignupActivateClick()
            } else {
                onSignupClick()
            }
        }
    }

    const isLoading = isSignupLoading || isGoogleLoading || isTelegramLoading || isSignupActivateLoading

    return (
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <VStack max gap="24" className={classNames(cls.SignupForm, {}, [className])}>
                <VStack gap="4" justify="center" align="center" max>
                    <Text
                        title={t('Регистрация в AI PBX')}
                        size="m"
                        align="center"
                    />
                    <Text
                        text={t('Голосовые ассистенты для бизнеса')}
                        size="s"
                        align="center"
                    />
                </VStack>

                {isLoading && (
                    <HStack max justify="center" className={cls.loaderWrapper}>
                        <Loader className={cls.signupLoader} />
                    </HStack>
                )}

                {signupError && (
                    <HStack max justify="center">
                        <Text text={signupError} variant="error" size="s" align="center" />
                    </HStack>
                )}

                <VStack max gap="16">
                    <Textarea
                        type="email"
                        label={t('Электронная почта') ?? ''}
                        placeholder={t('example@mail.com') ?? ''}
                        onChange={onChangeEmail}
                        autoComplete="email"
                        value={email}
                        fullWidth
                        disabled={isLoading}
                        required
                        sx={{
                            '& .MuiOutlinedInput-root:hover': {
                                backgroundColor: 'var(--light-bg-redesigned)',
                            },
                        }}
                    />

                    {isSignupActivation ? (
                        <VStack max gap="16">
                            <Textarea
                                type="text"
                                label={t('Введите код активации из почты') ?? ''}
                                placeholder={t('Введите код') ?? ''}
                                onChange={onChangeActivationCode}
                                value={activationSignupCode}
                                fullWidth
                                autoFocus
                                disabled={isLoading}
                                required
                            />
                            <Button
                                variant="glass-action"
                                fullWidth
                                onClick={onSignupActivateClick}
                                disabled={isLoading}
                                className={cls.submitBtn}
                            >
                                {t('Вход')}
                            </Button>

                            <HStack max justify="center" align="center" gap="8">
                                <Text text={t('Не пришло письмо?')} size="s" />
                                <Button
                                    variant="clear"
                                    onClick={onSignupClick}
                                    disabled={resendTimer > 0 || isLoading}
                                    size="s"
                                >
                                    {resendTimer > 0
                                        ? `${t('Повторить')} (${resendTimer})`
                                        : t('Повторить')}
                                </Button>
                            </HStack>
                        </VStack>
                    ) : (
                        <>
                            <HStack gap="8" align="start" className={cls.agreeRow}>
                                <input
                                    type="checkbox"
                                    id="agree-terms"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    className={cls.checkbox}
                                />
                                <label htmlFor="agree-terms" className={cls.agreeLabel}>
                                    {t('Регистрируясь, я принимаю')}{' '}
                                    <Link
                                        to={getRouteLegal()}
                                        target="_blank"
                                        className={cls.legalLink}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {t('пользовательское соглашение')}
                                    </Link>
                                </label>
                            </HStack>
                            <Button
                                variant="glass-action"
                                fullWidth
                                onClick={onSignupClick}
                                disabled={isLoading || !email || !agreeTerms}
                                className={cls.submitBtn}
                            >
                                {t('Регистрация')}
                            </Button>
                        </>
                    )}
                </VStack>

                <Divider className={cls.divider}>{t('или')}</Divider>

                <VStack gap="12" max>
                    <Button
                        variant="filled"
                        fullWidth
                        onClick={onGoogleSignupClick}
                        disabled={isLoading || !agreeTerms}
                        addonLeft={<GoogleIcon className={cls.socialIcon} />}
                        className={cls.socialBtn}
                    >
                        {t('Продолжить с Google')}
                    </Button>
                    <Button
                        variant="filled"
                        fullWidth
                        onClick={onTelegramSignupClick}
                        disabled={isLoading || !agreeTerms}
                        addonLeft={<TelegramIcon className={cls.socialIcon} />}
                        className={cls.socialBtn}
                    >
                        {t('Продолжить с Telegram')}
                    </Button>
                </VStack>

                <HStack max justify="center" align="center" gap="8">
                    <Text text={t('Уже есть аккаунт?')} />
                    <Button
                        variant="clear"
                        onClick={onLogin}
                        className={cls.loginLink}
                    >
                        {t('Вход')}
                    </Button>
                </HStack>
            </VStack>
        </form>
    )
})
