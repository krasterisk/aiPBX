import { memo, ChangeEvent } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Assistant } from '@/entities/Assistants/model/types/assistants'
import { SpeechSettingsCard } from '../SpeechSettingsCard'
import cls from './ParametersSection.module.scss'
import { ModelParametersCard } from '../ModelParametersCard'

interface ParametersSectionProps {
    className?: string
    onChangeTextHandler?: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export const ParametersSection = memo((props: ParametersSectionProps) => {
    const {
        className,
        onChangeTextHandler
    } = props

    return (
        <VStack max gap="16" className={classNames(cls.ParametersSection, {}, [className])}>
            {/* VAD Parameters - For all users */}
            <ModelParametersCard
                onChangeTextHandler={onChangeTextHandler}
            />

            {/* Advanced Settings - Admin only */}
            <SpeechSettingsCard
                onChangeTextHandler={onChangeTextHandler}
            />
        </VStack>
    )
})
