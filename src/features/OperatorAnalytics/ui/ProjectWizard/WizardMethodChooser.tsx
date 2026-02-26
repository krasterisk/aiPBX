import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Card } from '@/shared/ui/redesigned/Card'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import TuneIcon from '@mui/icons-material/Tune'
import { MetricMethod } from '@/entities/Report'
import cls from './ProjectWizard.module.scss'

interface WizardMethodChooserProps {
    onSelect: (method: MetricMethod) => void
}

export const WizardMethodChooser = memo(({ onSelect }: WizardMethodChooserProps) => {
    const { t } = useTranslation('reports')

    return (
        <VStack gap={'16'} max className={cls.methodChooser}>
            <VStack gap={'4'} align={'center'} max>
                <Text title={String(t('Как вы хотите настроить метрики?'))} bold />
                <Text text={String(t('Выберите способ формирования метрик для вашего проекта'))} />
            </VStack>

            <div className={cls.methodGrid}>
                <Card variant={'glass'} border={'partial'} padding={'24'}
                    className={cls.methodCard} onClick={() => onSelect('template')}>
                    <VStack gap={'12'} align={'center'}>
                        <div className={cls.methodIconWrap}>
                            <DashboardCustomizeIcon sx={{ fontSize: 36 }} />
                        </div>
                        <Text text={String(t('Готовый шаблон'))} bold />
                        <Text text={String(t('Выберите из готовых отраслевых шаблонов с предзаполненными метриками'))}
                            size={'s'} className={cls.methodDescription} />
                        <div className={cls.methodBadge}>{t('Быстрый старт')}</div>
                    </VStack>
                </Card>

                <Card variant={'glass'} border={'partial'} padding={'24'}
                    className={cls.methodCard} onClick={() => onSelect('ai_interview')}>
                    <VStack gap={'12'} align={'center'}>
                        <div className={cls.methodIconWrap}>
                            <SmartToyIcon sx={{ fontSize: 36 }} />
                        </div>
                        <Text text={String(t('AI Интервью'))} bold />
                        <Text text={String(t('AI задаст вопросы о вашем бизнесе и сам подберёт нужные метрики'))}
                            size={'s'} className={cls.methodDescription} />
                        <div className={`${cls.methodBadge} ${cls.accent}`}>{t('Рекомендуем')}</div>
                    </VStack>
                </Card>

                <Card variant={'glass'} border={'partial'} padding={'24'}
                    className={cls.methodCard} onClick={() => onSelect('manual')}>
                    <VStack gap={'12'} align={'center'}>
                        <div className={cls.methodIconWrap}>
                            <TuneIcon sx={{ fontSize: 36 }} />
                        </div>
                        <Text text={String(t('Выбрать вручную'))} bold />
                        <Text text={String(t('Выберите из стандартных метрик и добавьте свои собственные'))}
                            size={'s'} className={cls.methodDescription} />
                        <div className={cls.methodBadge}>{t('Полный контроль')}</div>
                    </VStack>
                </Card>
            </div>
        </VStack>
    )
})
