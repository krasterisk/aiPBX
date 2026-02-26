import { memo } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Divider } from '@/shared/ui/Divider'
import { Icon } from '@/shared/ui/redesigned/Icon'
import CloseIconSvg from '@/shared/assets/icons/close.svg'
import cls from './ProjectWizard.module.scss'

interface WizardHeaderProps {
    title: string
    onClose: () => void
}

export const WizardHeader = memo(({ title, onClose }: WizardHeaderProps) => (
    <VStack gap={'16'} max className={cls.wizardHeader}>
        <HStack max justify={'between'} align={'center'}>
            <Text title={title} bold size={'l'} />
            <button
                type={'button'}
                className={cls.headerCloseBtn}
                onClick={onClose}
                aria-label={'Close'}
            >
                <Icon Svg={CloseIconSvg} className={cls.headerCloseBtnIcon} />
            </button>
        </HStack>
        <Divider />
    </VStack>
))
