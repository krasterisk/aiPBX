import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './SignupForm.module.scss'
import { useTranslation } from 'react-i18next'
import React, { memo } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Loader } from '@/shared/ui/Loader'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Button } from '@/shared/ui/redesigned/Button'
import { Divider } from '@/shared/ui/Divider'
import GoogleIcon from '@/shared/assets/icons/googleIcon.svg'
import TelegramIcon from '@mui/icons-material/Telegram'
import { useSignupData } from '../../lib/hooks/useSignupData'

interface SignupFormProps {
  className?: string

}

export const SignupForm = memo((props: SignupFormProps) => {
  const {
    className
  } = props

  const { t } = useTranslation('login')

  const {
    isSignupLoading,
    isSignupError,
    isGoogleLoading,
    isTelegramLoading,
    isSignupActivateLoading,
    isSignupActivateError,
    isSignupActivation,
    signupActivationError,
    email,
    activationSignupCode,
    onLogin,
    onChangeActivationCode,
    onSignupActivateClick,
    onTelegramSignupClick,
    onSignupClick,
    onChangeEmail,
    onGoogleSignupClick
  } = useSignupData()

  return (
            <VStack max gap={'16'} className={classNames(cls.SignupForm, {}, [className])}>
                <VStack gap={'4'} justify={'center'} align={'center'} max>
                    <Text title={t('Регистрация в AI PBX')} />
                    <Text text={t('Голосовые ассистенты для бизнеса')} />
                </VStack>
                {isSignupError &&
                    <HStack max justify={'center'} align={'center'}>
                        <Text text={t('Ошибка при создании пользователя')} variant={'error'} />
                    </HStack>
                }
                {isSignupActivateError &&
                    <Text
                        text={t('Ошибка активации, пожалуйста, попробуйте позже') +
                            String(signupActivationError)}
                        variant={'error'}
                    />
                }
                {(isSignupLoading || isGoogleLoading || isTelegramLoading || isSignupActivateLoading) &&
                    <HStack max justify={'center'}>
                        <Loader className={cls.signupLoader}/>
                    </HStack>
                }
                <Textarea
                    type={'email'}
                    label={t('Электронная почта') ?? ''}
                    onChange={onChangeEmail}
                    autoComplete={'email'}
                    value={email}
                    fullWidth
                    required
                />
                {isSignupActivation
                  ? <VStack max>
                        <Text
                            text={t('Введите код активации из почты') + ':'}
                            bold
                        />
                        <Textarea
                            type="text"
                            className={cls.input}
                            placeholder={t('Код активации') ?? ''}
                            onChange={onChangeActivationCode}
                            value={activationSignupCode}
                            fullWidth
                        />
                        <Button
                            variant={'filled'}
                            fullWidth
                            className={cls.signupBtn}
                            onClick={() => {
                              onSignupActivateClick()
                            }}
                            disabled={isSignupActivateLoading}
                        >
                            {t('Вход')}
                        </Button>
                    </VStack>
                  : <Button
                        variant={'filled'}
                        fullWidth
                        className={cls.signupBtn}
                        onClick={() => {
                          onSignupClick()
                        }}
                        disabled={isSignupLoading}
                    >
                        {t('Регистрация')}
                    </Button>
                }
                <Divider>{t('или')}</Divider>
                <VStack gap={'0'} max>
                    <Button
                        variant={'filled'}
                        fullWidth
                        className={cls.signupBtn}
                        onClick={onGoogleSignupClick}
                        disabled={isSignupLoading}
                        addonLeft={<GoogleIcon/>}
                    >
                        {t('Продолжить с Google')}
                    </Button>
                    <Button
                        variant={'filled'}
                        fullWidth
                        className={cls.signupBtn}
                        onClick={onTelegramSignupClick}
                        disabled={isSignupLoading}
                        addonLeft={<TelegramIcon />}
                    >
                        {t('Продолжить с Telegram')}
                    </Button>
                </VStack>
                <HStack max justify={'center'}>
                    <Text text={t('Уже есть аккаунт?')}/>
                    <Button
                        variant={'clear'}
                        className={cls.linkButton}
                        onClick={onLogin}
                    >
                        {t('Вход')}
                    </Button>
                </HStack>
            </VStack>
  )
})
