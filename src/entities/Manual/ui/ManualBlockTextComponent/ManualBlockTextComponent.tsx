import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ManualBlockTextComponent.module.scss'
import { memo } from 'react'
import { ManualTextBlock } from '../../model/types/manual'
import { Text } from '@/shared/ui/redesigned/Text'

interface ManualBlockTextComponentProps {
  className?: string
  block: ManualTextBlock
}

export const ManualBlockTextComponent = memo(({ className, block }: ManualBlockTextComponentProps) => {
  return (
        <div className={classNames(cls.ManualBlockTextComponent, {}, [className])}>

            {block.title && (
                <Text title={block.title} className={cls.title} />
            )}
            {block.paragraphs.length && block.paragraphs.map((par) => (
                <Text text={par.paragraph} className={cls.paragraph} key={par.id}/>
            ))}
        </div>
  )
})
