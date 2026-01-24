import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantItem.module.scss'
import React, { HTMLAttributeAnchorTarget, memo } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Check } from '@/shared/ui/mui/Check'
import { Assistant } from '../../model/types/assistants'
import { AssistantMenu } from '../AssistantMenu/AssistantMenu'
import { getRouteAssistantEdit } from '@/shared/const/router'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { ContentView } from '@/entities/Content'

interface AssistantItemProps {
    className?: string
    assistant: Assistant
    onEdit?: (id: string) => void
    view?: ContentView
    target?: HTMLAttributeAnchorTarget
    checkedItems?: string[]
    onChangeChecked?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const AssistantItem = memo((props: AssistantItemProps) => {
    const {
        className,
        assistant,
        view = 'SMALL',
        checkedItems,
        onChangeChecked,
        target
    } = props

    if (view === 'BIG') {
        return (
            <Card
                padding={'16'}
                max
                border={'partial'}
                className={classNames(cls.AssistantItem, {}, [className, cls[view]])}
            >
                <HStack
                    max
                    gap={'16'}
                    wrap={'wrap'}
                    justify={'start'}
                >
                    <Check
                        key={String(assistant.id)}
                        className={classNames('', {
                            [cls.uncheck]: !checkedItems?.includes(String(assistant.id)),
                            [cls.check]: checkedItems?.includes(String(assistant.id))
                        }, [])}
                        value={String(assistant.id)}
                        size={'small'}
                        checked={checkedItems?.includes(String(assistant.id))}
                        onChange={onChangeChecked}
                    />
                    <AppLink target={target} to={getRouteAssistantEdit(assistant.id || '')}>
                        <VStack max>
                            <Text title={assistant.name} />
                            {assistant.comment ? <HStack><Text text={assistant.comment} /></HStack> : ''}
                        </VStack>
                    </AppLink>
                </HStack>
                <AssistantMenu id={assistant.id || ''} className={cls.menu} />
            </Card>
        )
    }

    return (
        <Card
            padding={'24'}
            border={'partial'}
            className={classNames(cls.AssistantItem, {}, [className, cls[view]])}
        >
            <VStack
                gap={'8'}
                justify={'start'}
            >
                <Check
                    key={String(assistant.id)}
                    className={classNames('', {
                        [cls.uncheck]: !checkedItems?.includes(String(assistant.id)),
                        [cls.check]: checkedItems?.includes(String(assistant.id))
                    }, [])}
                    value={String(assistant.id)}
                    size={'small'}
                    checked={checkedItems?.includes(String(assistant.id))}
                    onChange={onChangeChecked}
                />
                <AppLink target={target} to={getRouteAssistantEdit(assistant.id || '')}>
                    <Text title={assistant.name} />
                    {assistant.comment ? <HStack><Text text={assistant.comment} /></HStack> : ''}
                </AppLink>
            </VStack>
            <AssistantMenu id={assistant.id || ''} className={cls.menu} />
        </Card>
    )
})
