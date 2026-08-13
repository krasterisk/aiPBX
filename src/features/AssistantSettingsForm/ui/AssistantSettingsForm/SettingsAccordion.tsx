import { memo, ReactNode } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { LucideIcon } from 'lucide-react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantSettingsForm.module.scss'

interface SettingsAccordionProps {
    id: string
    title: string
    icon: LucideIcon
    expanded: boolean
    onChange: (expanded: boolean) => void
    error?: boolean
    children: ReactNode
    className?: string
    detailsClassName?: string
    'data-testid'?: string
}

export const SettingsAccordion = memo((props: SettingsAccordionProps) => {
    const {
        id,
        title,
        icon: Icon,
        expanded,
        onChange,
        error,
        children,
        className,
        detailsClassName,
        'data-testid': testId,
    } = props

    return (
        <Accordion
            expanded={expanded}
            onChange={(_, next) => { onChange(next) }}
            disableGutters
            className={classNames(cls.accordion, {}, [className])}
            data-testid={testId}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className={cls.summary}
                aria-controls={`${id}-content`}
                id={`${id}-header`}
            >
                <span className={cls.summaryHead}>
                    <span className={cls.summaryIcon} aria-hidden>
                        <Icon size={18} strokeWidth={2} />
                    </span>
                    <span
                        className={classNames(cls.summaryTitle, {
                            [cls.summaryTitleError]: error,
                        })}
                    >
                        {title}
                    </span>
                </span>
            </AccordionSummary>
            <AccordionDetails className={classNames(cls.details, {}, [detailsClassName])}>
                {children}
            </AccordionDetails>
        </Accordion>
    )
})
