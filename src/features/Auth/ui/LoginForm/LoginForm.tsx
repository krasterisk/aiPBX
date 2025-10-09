import cls from './LoginForm.module.scss'
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
import { useLoginData } from '../../lib/hooks/useLoginData'

interface LoginFormProps {
  className?: string
}

export const LoginForm = memo((props: LoginFormProps) => {
  const {
    className
  } = props
  const { t } = useTranslation('login')

  const {
    email,
    activationLoginCode,
    resendTimer,
    isLoginLoading,
    isLoginActivation,
    isLoginActivateLoading,
    onLoginActivateClick,
    onChangeActivationCode,
    onLoginClick,
    isGoogleLoading,
    onGoogleLoginClick,
    isTelegramLoading,
    onTelegramLoginClick,
    onSignup,
    onChangeEmail
  } = useLoginData()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isLoginActivation) {
      onLoginActivateClick()
    } else {
      onLoginClick()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()

      if (isLoginActivation) {
        onLoginActivateClick()
      } else {
        onLoginClick()
      }
    }
  }

  return (
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <VStack max gap={'16'} className={className}>
            <VStack gap={'4'} justify={'center'} align={'center'} max>
                <Text title={t('Вход в облачную AI PBX')}/>
                <Text text={t('Голосовые ассистенты для бизнеса')}/>
            </VStack>
            {(isLoginLoading || isGoogleLoading || isTelegramLoading || isLoginActivateLoading) &&
                <HStack max justify={'center'}>
                    <Loader className={cls.loginLoader}/>
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
                {isLoginActivation
                  ? <VStack max gap={'16'}>
                        <Text
                            text={t('Введите код активации из почты') + ':'}
                            bold
                        />
                        <Textarea
                            type="text"
                            className={cls.input}
                            placeholder={t('Введите код') ?? ''}
                            onChange={onChangeActivationCode}
                            value={activationLoginCode}
                            fullWidth
                            required
                        />
                        <Button
                            variant={'filled'}
                            fullWidth
                            className={cls.loginBtn}
                            onClick={onLoginActivateClick}
                            disabled={isLoginActivateLoading}
                        >
                            {t('Продолжить')}
                        </Button>
                        <HStack
                            max
                            justify={'center'}
                            align={'center'}
                        >
                            <Text text={t('Не пришло письмо?')}/>
                            <Button
                                variant={'clear'}
                                className={cls.linkButton}
                                onClick={onLoginClick}
                                disabled={resendTimer > 0}
                            >
                                {resendTimer > 0 ? `${t('Повторить')} (${resendTimer})` : t('Повторить')}
                            </Button>
                        </HStack>
                    </VStack>
                  : <Button
                        variant={'filled'}
                        fullWidth
                        className={cls.loginBtn}
                        onClick={onLoginClick}
                        disabled={isLoginLoading}
                    >
                        {t('Вход')}
                    </Button>
                }
                <Divider>{t('или')}</Divider>
                <VStack gap={'0'} max>
                    <Button
                        variant={'filled'}
                        fullWidth
                        className={cls.loginBtn}
                        onClick={onGoogleLoginClick}
                        disabled={isLoginLoading}
                        addonLeft={<GoogleIcon/>}
                    >
                        {t('Вход через Google')}
                    </Button>
                    <Button
                        variant={'filled'}
                        fullWidth
                        className={cls.loginBtn}
                        onClick={onTelegramLoginClick}
                        disabled={isLoginLoading}
                        addonLeft={<TelegramIcon/>}
                    >
                        {t('Вход через Telegram')}
                    </Button>
                </VStack>
                <HStack max justify={'center'}>
                    <Text text={t('Ещё нет аккаунта?')}/>
                    <Button
                        variant={'clear'}
                        className={cls.linkButton}
                        onClick={onSignup}
                    >
                        {t('Регистрация')}
                    </Button>
                </HStack>
        </VStack>
      </form>
  )
})
