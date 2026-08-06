import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack } from '@/shared/ui/redesigned/Stack'
import cls from './ProjectWizard.module.scss'

export type CreateWizardStep = 1 | 2 | 3

interface WizardPhaseIndicatorProps {
    createStep: CreateWizardStep
    onGoToStep: (step: CreateWizardStep) => void
}

const STEP_LABELS: Record<CreateWizardStep, string> = {
    1: 'Название',
    2: 'Метрики',
    3: 'Темы',
}

export const WizardPhaseIndicator = memo(({
    createStep,
    onGoToStep,
}: WizardPhaseIndicatorProps) => {
    const { t } = useTranslation('reports')
    const steps: CreateWizardStep[] = [1, 2, 3]

    return (
        <HStack gap={'8'} align={'center'} wrap={'wrap'} className={cls.phaseIndicator}>
            {steps.map((step, index) => {
                const completed = createStep > step
                const active = createStep === step
                return (
                    <HStack key={step} gap={'8'} align={'center'}>
                        {index > 0 && <div className={cls.phaseConnector} />}
                        <button
                            type={'button'}
                            className={`${cls.phaseStep} ${active ? cls.active : ''} ${completed ? cls.completed : ''}`}
                            onClick={() => { if (completed) onGoToStep(step) }}
                            disabled={!completed && !active}
                        >
                            <span className={cls.phaseNumber}>{completed ? '✓' : String(step)}</span>
                            {String(t(STEP_LABELS[step]))}
                        </button>
                    </HStack>
                )
            })}
        </HStack>
    )
})
