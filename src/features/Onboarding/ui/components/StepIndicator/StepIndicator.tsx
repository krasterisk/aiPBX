import React, { memo } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './StepIndicator.module.scss'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import {
    Briefcase,
    Send,
    Globe,
    PartyPopper,
    Check
} from 'lucide-react'

interface StepIndicatorProps {
    currentStep: number
    totalSteps: number
    className?: string
}

const stepIcons = [Briefcase, Send, Globe, PartyPopper]

export const StepIndicator = memo(({ currentStep, totalSteps, className }: StepIndicatorProps) => {
    const progress = Math.min(100, Math.max(0, ((currentStep - 1) / (totalSteps - 2)) * 100))

    return (
        <VStack
            gap="12"
            max
            className={className}
            {...{ style: { '--progress': `${progress}%` } as React.CSSProperties }}
        >
            <VStack max className={cls.progressTrack}>
                <VStack className={cls.progressFill}>{null}</VStack>
            </VStack>
            <HStack justify="between" max>
                {stepIcons.map((Icon, index) => {
                    const stepIndex = index + 1
                    return (
                        <HStack
                            key={index}
                            justify="center"
                            align="center"
                            className={classNames(cls.stepDot, {
                                [cls.active]: stepIndex === currentStep,
                                [cls.completed]: stepIndex < currentStep,
                                [cls.upcoming]: stepIndex > currentStep
                            })}
                        >
                            {stepIndex < currentStep
                                ? <Check size={14} />
                                : <Icon size={14} />
                            }
                        </HStack>
                    )
                })}
            </HStack>
        </VStack>
    )
})
