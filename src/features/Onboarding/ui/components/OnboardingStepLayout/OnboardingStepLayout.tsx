import { memo, ReactNode } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from '../../OnboardingWizard/OnboardingWizard.module.scss'

interface OnboardingStepLayoutProps {
    className?: string
    bodyAlign?: 'center' | 'start'
    footer?: ReactNode
    footerAlign?: 'between' | 'end'
    children: ReactNode
    'data-testid'?: string
}

export const OnboardingStepLayout = memo(({
    className,
    bodyAlign = 'center',
    footer,
    footerAlign = 'between',
    children,
    'data-testid': testId,
}: OnboardingStepLayoutProps) => (
    <div
        className={classNames(cls.stepShell, {}, [className])}
        data-testid={testId}
    >
        <div
            className={classNames(cls.stepBody, {
                [cls.stepBodyStart]: bodyAlign === 'start',
            })}
        >
            <div className={cls.stepBodyInner}>
                {children}
            </div>
        </div>
        {footer
            ? (
                <div
                    className={classNames(cls.stepFooter, {
                        [cls.stepFooterEnd]: footerAlign === 'end',
                    })}
                >
                    {footer}
                </div>
            )
            : null}
    </div>
))
