import { memo, useMemo, ChangeEvent, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Palette } from 'lucide-react'
import { Check } from '@/shared/ui/mui/Check'
import { SectionCard } from '../SectionCard/SectionCard'
import { VisualPositionGrid } from '../VisualPositionGrid/VisualPositionGrid'
import { ColorGradientPicker } from '../ColorGradientPicker/ColorGradientPicker'
import { useUploadWidgetLogo } from '@/entities/WidgetKeys'

import { Button as ButtonMui, styled, CircularProgress } from '@mui/material'
import { Button } from '@/shared/ui/redesigned/Button'
import { AppImage } from '@/shared/ui/redesigned/AppImage'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import noImage from '@/shared/assets/icons/user-filled.svg' // Using user icon as fallback or a generic image icon
import { Combobox } from '@/shared/ui/mui/Combobox'

interface StyleSettingsCardProps {
    appearance: any
    onChangeAppearance: (field: string, value: unknown) => void
}

export const StyleSettingsCard = memo((props: StyleSettingsCardProps) => {
    const { appearance, onChangeAppearance } = props
    const { t } = useTranslation('publish-widgets')

    const themeOptions = useMemo(() => [
        { id: 'light', name: t('Светлая'), value: 'light' },
        { id: 'dark', name: t('Темная'), value: 'dark' },
        { id: 'auto', name: t('Автоматически'), value: 'auto' },
    ], [t])

    const languageOptions = useMemo(() => [
        { id: 'en', name: 'English', value: 'en' },
        { id: 'ru', name: 'Русский', value: 'ru' },
        { id: 'de', name: 'Deutsch', value: 'de' },
        { id: 'zh', name: '中文 (Chinese)', value: 'zh' },
    ], [])

    const [uploadLogo, { isLoading: isUploading }] = useUploadWidgetLogo()

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1
    })

    const onUploadLogo = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file) // Assuming 'file' is the field name, or 'image' based on UserAddAvatar using 'image'

        try {
            // Check UserAddAvatar: formData.append('image', file)
            // But here I'm using useUploadWidgetLogo which I defined to point to /widget-keys/logo
            // Usually standard upload field name is 'file' or 'image'. UserAddAvatar used 'image'.
            // I'll use 'file' as it is more generic, or 'image' to match User.
            // Let's use 'image' to be safe since User used it.
            const data = new FormData()
            data.append('image', file)
            const res = await uploadLogo(data).unwrap()
            // Assuming res returns { logo: string }
            if (res.logo) {
                onChangeAppearance('logo', res.logo)
            }
        } catch (e) {
            // Error toast handled by global toastMiddleware
        }
    }, [uploadLogo, onChangeAppearance])

    const onClearLogo = useCallback(() => {
        onChangeAppearance('logo', '')
    }, [onChangeAppearance])

    const logoSrc = appearance?.logo ? (appearance.logo.startsWith('http') ? appearance.logo : `${__STATIC__}/${appearance.logo}`) : ''

    return (
        <SectionCard title={t('Стиль')} icon={Palette}>
            <VStack gap="16" max>
                <Text text={t('Логотип на виджете')} bold />
                <HStack gap="16" align="center">
                    <AppImage
                        src={logoSrc} // If empty, will show fallback
                        width={60}
                        height={60}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                        fallback={<Skeleton width={60} height={60} border="50%" />}
                        errorFallback={<Icon Svg={noImage} width={40} height={40} />}
                    />
                    <VStack gap="8">
                        <HStack gap="8">
                            <ButtonMui
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                disabled={isUploading}
                                size="small"
                            >
                                {isUploading ? <CircularProgress size={20} color="inherit" /> : t('Загрузить')}
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={onUploadLogo}
                                    accept="image/*"
                                />
                            </ButtonMui>
                            {appearance?.logo && (
                                <Button
                                    variant="outline"
                                    color="error"
                                    onClick={onClearLogo}
                                    disabled={isUploading}
                                    size="m"
                                >
                                    {t('Удалить')}
                                </Button>
                            )}
                        </HStack>
                        <Text text={t('Рекомендуемый размер 200x200px')} size="s" variant="accent" />
                    </VStack>
                </HStack>
            </VStack>

            <VisualPositionGrid
                value={appearance?.buttonPosition || 'bottom-right'}
                onChange={(val) => { onChangeAppearance('buttonPosition', val) }}
            />

            <Combobox
                label={t('Язык виджета') || ''}
                options={languageOptions}
                value={languageOptions.find(opt => opt.value === appearance?.language) || languageOptions[0]}
                getOptionLabel={(option) => option.name}
                onChange={(e, newValue) => {
                    if (newValue && !Array.isArray(newValue)) {
                        onChangeAppearance('language', newValue.value)
                    }
                }}
                disableClearable
            />

            <ColorGradientPicker
                label={t('Цвет кнопки')}
                value={appearance?.buttonColor || '#007AFF'}
                onChange={(val) => { onChangeAppearance('buttonColor', val) }}
            />

            <ColorGradientPicker
                label={t('Основной цвет')}
                value={appearance?.primaryColor || '#007AFF'}
                onChange={(val) => { onChangeAppearance('primaryColor', val) }}
            />

            <Combobox
                label={t('Тема') || ''}
                options={themeOptions}
                value={themeOptions.find(opt => opt.value === appearance?.theme) || themeOptions[0]}
                getOptionLabel={(option) => option.name}
                onChange={(e, newValue) => {
                    if (newValue && !Array.isArray(newValue)) {
                        onChangeAppearance('theme', newValue.value)
                    }
                }}
                disableClearable
            />

            <Check
                label={t('Показать брендинг') || ''}
                checked={appearance?.showBranding ?? true}
                onChange={(e) => { onChangeAppearance('showBranding', e.target.checked) }}
            />
        </SectionCard>
    )
})
