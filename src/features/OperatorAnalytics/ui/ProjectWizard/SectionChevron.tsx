import { memo } from 'react'
import { ChevronDown } from 'lucide-react'
import cls from './ProjectWizard.module.scss'

interface SectionChevronProps {
    open: boolean
}

export const SectionChevron = memo(({ open }: SectionChevronProps) => (
    <span
        className={`${cls.sectionChevron} ${open ? cls.sectionChevronOpen : ''}`}
        aria-hidden
    >
        <ChevronDown size={18} strokeWidth={2} />
    </span>
))
