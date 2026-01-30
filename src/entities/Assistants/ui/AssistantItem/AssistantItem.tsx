import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantItem.module.scss'
import React, { HTMLAttributeAnchorTarget, memo, useCallback } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Check } from '@/shared/ui/mui/Check'
import { Assistant } from '../../model/types/assistants'
import { getRouteAssistantEdit } from '@/shared/const/router'
import { ContentView } from '@/entities/Content'
import { useNavigate } from 'react-router-dom'

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
    } = props

    const navigate = useNavigate()

    const onOpenEdit = useCallback(() => {
        navigate(getRouteAssistantEdit(assistant.id || ''))
    }, [assistant.id, navigate])

    const onCheckClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
    }, [])

    if (view === 'BIG') {
        return (
            <Card
                padding={'16'}
                max
                border={'partial'}
                className={classNames(cls.AssistantItem, {}, [className, cls[view]])}
                onClick={onOpenEdit}
            >
                <HStack
                    max
                    gap={'16'}
                    wrap={'wrap'}
                    justify={'start'}
                >
                    <div onClick={onCheckClick}>
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
                    </div>
                    <VStack max>
                        <Text title={assistant.name} />
                        {assistant.comment ? <HStack><Text text={assistant.comment} /></HStack> : ''}
                    </VStack>
                </HStack>
            </Card>
        )
    }

    return (
        <Card
            padding={'24'}
            border={'partial'}
            className={classNames(cls.AssistantItem, {}, [className, cls[view]])}
            onClick={onOpenEdit}
        >
            <VStack
                gap={'8'}
                justify={'start'}
            >
                <div onClick={onCheckClick}>
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
                </div>
                <VStack gap={'4'}>
                    <Text title={assistant.name} />
                    {assistant.comment ? <HStack><Text text={assistant.comment} /></HStack> : ''}
                </VStack>
            </VStack>
        </Card>
    )
})
