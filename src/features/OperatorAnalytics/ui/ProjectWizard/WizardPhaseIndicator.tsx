import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { MetricMethod } from '@/entities/Report'
import cls from './ProjectWizard.module.scss'

interface WizardPhaseIndicatorProps {
    method: MetricMethod
    isInMethodStep: boolean
    isInReview: boolean
    onBackToMethod: () => void
    onBackToStep: () => void
}

export const WizardPhaseIndicator = memo(({
    method,
    isInMethodStep,
    isInReview,
    onBackToMethod,
    onBackToStep,
}: WizardPhaseIndicatorProps) => {
    const { t } = useTranslation('reports')

    const methodLabel =
        method === 'template' ? t('Шаблон')
            : method === 'ai_interview' ? t('AI Интервью')
                : t('Метрики')

    return (
        <HStack gap={'8'} align={'center'} wrap={'wrap'} className={cls.phaseIndicator}>
            <button type={'button'}
                className={`${cls.phaseStep} ${cls.completed}`}
                onClick={onBackToMethod}>
                <span className={cls.phaseNumber}>{'✓'}</span>
                {t('Способ')}
            </button>

            <div className={cls.phaseConnector} />

            <button type={'button'}
                className={`${cls.phaseStep} ${isInMethodStep ? cls.active : ''} ${isInReview ? cls.completed : ''}`}
                onClick={() => { if (isInReview) onBackToStep() }}>
                <span className={cls.phaseNumber}>{isInReview ? '✓' : '2'}</span>
                {methodLabel}
            </button>

            <div className={cls.phaseConnector} />

            <button type={'button'}
                className={`${cls.phaseStep} ${isInReview ? cls.active : ''}`}
                disabled={!isInReview}>
                <span className={cls.phaseNumber}>3</span>
                {t('Настройка')}
            </button>
        </HStack>
    )
})
