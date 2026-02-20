import React, { memo } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './TelegramMockup.module.scss'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import AipbxLogo from '@/shared/assets/icons/aipbx_logo_v3.svg'
import { Clock } from 'lucide-react'

interface TelegramMockupProps {
    templateId: string | null
    className?: string
}

// Maps template IDs to their i18n mockup key prefix
const templateMockupKeys: Record<string, string> = {
    appliance_repair: 'repair',
    pizzeria: 'pizza',
    dental_clinic: 'clinic',
    real_estate: 'realestate',
    hotel_reception: 'hotel',
    auto_service: 'auto',
    fitness_club: 'fitness',
    beauty_salon: 'beauty',
    custom: 'custom'
}

const DETAILS_PER_MOCKUP = 3

export const TelegramMockup = memo(({ templateId, className }: TelegramMockupProps) => {
    const { t } = useTranslation('onboarding')
    const prefix = templateMockupKeys[templateId || 'custom'] || 'custom'

    const title = t(`mockup_${prefix}_title`) 
    const details: string[] = []
    for (let i = 1; i <= DETAILS_PER_MOCKUP; i++) {
        details.push(t(`mockup_${prefix}_detail_${i}`))
    }

    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    return (
        <VStack className={classNames(cls.TelegramMockup, {}, [className])}>
            <HStack gap="12" className={cls.header}>
                <HStack justify="center" align="center" className={cls.avatar}>
                    <AipbxLogo width={22} height={22} />
                </HStack>
                <VStack gap="0">
                    <Text text="AI PBX Bot" bold size="xs" />
                    <Text
                        text={t('telegram_mockup_online') }
                        variant="success"
                        size="xs"
                    />
                </VStack>
            </HStack>
            <VStack gap="8" className={cls.message}>
                <VStack gap="4" className={cls.bubble}>
                    <Text text={title} bold size="xs" variant="accent" />
                    <VStack gap="0">
                        {details.map((line, i) => (
                            <Text key={i} text={line} size="xs" className={cls.detailLine} />
                        ))}
                    </VStack>
                    <HStack gap="4" justify="end" align="center" max>
                        <Clock size={10} className={cls.timeIcon} />
                        <Text text={timeStr} size="xs" className={cls.timeText} />
                    </HStack>
                </VStack>
            </VStack>
        </VStack>
    )
})
