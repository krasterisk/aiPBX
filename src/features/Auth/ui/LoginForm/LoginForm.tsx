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
  const { className } = props
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
    onChangeEmail,
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

  const isLoading = isLoginLoading || isGoogleLoading || isTelegramLoading || isLoginActivateLoading

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className={className}>
      <VStack max gap="24">
        <VStack gap="4" justify="center" align="center" max>
          <Text
            title={t('Вход в облачную AI PBX')}
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
            <Loader className={cls.loginLoader} />
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
          />

          {isLoginActivation ? (
            <VStack max gap="16">
              <Textarea
                type="text"
                label={t('Введите код активации из почты') ?? ''}
                placeholder={t('Введите код') ?? ''}
                onChange={onChangeActivationCode}
                value={activationLoginCode}
                fullWidth
                autoFocus
                disabled={isLoading}
                required
              />
              <Button
                variant="glass-action"
                fullWidth
                onClick={onLoginActivateClick}
                disabled={isLoading}
                className={cls.submitBtn}
              >
                {t('Продолжить')}
              </Button>

              <HStack max justify="center" align="center" gap="8">
                <Text text={t('Не пришло письмо?')} size="s" />
                <Button
                  variant="clear"
                  onClick={onLoginClick}
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
            <Button
              variant="glass-action"
              fullWidth
              onClick={onLoginClick}
              disabled={isLoading || !email}
              className={cls.submitBtn}
            >
              {t('Вход')}
            </Button>
          )}
        </VStack>

        <Divider className={cls.divider}>{t('или')}</Divider>

        <VStack gap="12" max>
          <Button
            variant="filled"
            fullWidth
            onClick={onGoogleLoginClick}
            disabled={isLoading}
            addonLeft={<GoogleIcon className={cls.socialIcon} />}
            className={cls.socialBtn}
          >
            {t('Вход через Google')}
          </Button>
          <Button
            variant="filled"
            fullWidth
            onClick={onTelegramLoginClick}
            disabled={isLoading}
            addonLeft={<TelegramIcon className={cls.socialIcon} />}
            className={cls.socialBtn}
          >
            {t('Вход через Telegram')}
          </Button>
        </VStack>

        <HStack max justify="center" align="center" gap="8">
          <Text text={t('Ещё нет аккаунта?')} />
          <Button
            variant="clear"
            onClick={onSignup}
            className={cls.signupLink}
          >
            {t('Регистрация')}
          </Button>
        </HStack>
      </VStack>
    </form>
  )
})
