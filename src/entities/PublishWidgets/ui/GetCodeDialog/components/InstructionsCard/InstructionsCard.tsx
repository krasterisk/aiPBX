import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './InstructionsCard.module.scss'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Icon } from '@/shared/ui/redesigned/Icon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoIcon from '@mui/icons-material/Info'
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'

interface InstructionsCardProps {
    className?: string
}

export const InstructionsCard = memo((props: InstructionsCardProps) => {
    const { className } = props
    const { t } = useTranslation('publish-widgets')

    return (
        <Card
            padding="24"
            max
            border="partial"
            className={classNames(cls.InstructionsCard, {}, [className])}
        >
            <VStack gap="16" max>
                <HStack gap="12" align="center">
                    <Icon Svg={InfoIcon} className={cls.icon} />
                    <Text title={t('Инструкции по установке')} size="l" bold />
                </HStack>

                <div className={cls.accordionContainer}>
                    <Accordion className={cls.accordion} defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Text text={t('Общая инструкция')} bold />
                        </AccordionSummary>
                        <AccordionDetails>
                            <ul className={cls.instructionsList}>
                                <li className={cls.instructionItem}>
                                    {t('Скопируйте код выше')}
                                </li>
                                <li className={cls.instructionItem}>
                                    {t('Откройте HTML вашего сайта')}
                                </li>
                                <li className={cls.instructionItem}>
                                    {t('Вставьте перед </body>')}
                                </li>
                                <li className={cls.instructionItem}>
                                    {t('Сохраните и обновите!')}
                                </li>
                            </ul>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion className={cls.accordion}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Text text={'WordPress'} bold />
                        </AccordionSummary>
                        <AccordionDetails>
                            <VStack gap="8">
                                <p dangerouslySetInnerHTML={{ __html: t('WordPress_Step1') }} />
                                <p dangerouslySetInnerHTML={{ __html: t('WordPress_Step2') }} />
                                <p dangerouslySetInnerHTML={{ __html: t('WordPress_Step3') }} />
                                <p dangerouslySetInnerHTML={{ __html: t('WordPress_Step4') }} />
                                <div className={cls.alternative}>
                                    <p dangerouslySetInnerHTML={{ __html: t('WordPress_Alternative') }} />
                                </div>
                            </VStack>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion className={cls.accordion}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Text text={'Shopify'} bold />
                        </AccordionSummary>
                        <AccordionDetails>
                            <VStack gap="8">
                                <p dangerouslySetInnerHTML={{ __html: t('Shopify_Step1') }} />
                                <p dangerouslySetInnerHTML={{ __html: t('Shopify_Step2') }} />
                                <p dangerouslySetInnerHTML={{ __html: t('Shopify_Step3') }} />
                                <p dangerouslySetInnerHTML={{ __html: t('Shopify_Step4') }} />
                                <p dangerouslySetInnerHTML={{ __html: t('Shopify_Step5') }} />
                            </VStack>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion className={cls.accordion}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Text text={'Wix'} bold />
                        </AccordionSummary>
                        <AccordionDetails>
                            <VStack gap="8">
                                <p dangerouslySetInnerHTML={{ __html: t('Wix_Step1') }} />
                                <p dangerouslySetInnerHTML={{ __html: t('Wix_Step2') }} />
                                <p dangerouslySetInnerHTML={{ __html: t('Wix_Step3') }} />
                                <p dangerouslySetInnerHTML={{ __html: t('Wix_Step4') }} />
                                <p dangerouslySetInnerHTML={{ __html: t('Wix_Step5') }} />
                                <p dangerouslySetInnerHTML={{ __html: t('Wix_Step6') }} />
                            </VStack>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </VStack>
        </Card>
    )
})
