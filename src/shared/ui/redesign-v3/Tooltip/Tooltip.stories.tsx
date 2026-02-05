import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './Tooltip'
import { HStack, VStack } from '../../redesigned/Stack'
import { Button } from '../Button'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

const meta: Meta<typeof Tooltip> = {
    title: 'shared/redesign-v3/Tooltip',
    component: Tooltip,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
    argTypes: {
        placement: {
            control: 'select',
            options: ['top', 'bottom', 'left', 'right']
        }
    }
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Top: Story = {
    args: {
        title: 'Это подсказка сверху',
        placement: 'top',
        children: (
            <Button variant="outline">
                Наведите меня
            </Button>
        )
    }
}

export const Bottom: Story = {
    args: {
        title: 'Это подсказка снизу',
        placement: 'bottom',
        children: (
            <Button variant="outline">
                Наведите меня
            </Button>
        )
    }
}

export const Left: Story = {
    args: {
        title: 'Это подсказка слева',
        placement: 'left',
        children: (
            <Button variant="outline">
                Наведите меня
            </Button>
        )
    }
}

export const Right: Story = {
    args: {
        title: 'Это подсказка справа',
        placement: 'right',
        children: (
            <Button variant="outline">
                Наведите меня
            </Button>
        )
    }
}

export const WithIcon: Story = {
    args: {
        title: 'Нажмите на иконку для получения помощи. На мобильных устройствах tooltip откроется по клику.',
        placement: 'top',
        children: (
            <HelpOutlineIcon fontSize="small" style={{ color: 'var(--hint-redesigned)', cursor: 'help' }} />
        )
    }
}

export const LongText: Story = {
    args: {
        title: 'Это очень длинный текст подсказки, который должен корректно переноситься на несколько строк и не выходить за пределы максимальной ширины компонента',
        placement: 'top',
        children: (
            <Button variant="outline">
                Длинная подсказка
            </Button>
        )
    }
}

export const AllPlacements: Story = {
    render: () => (
        <VStack gap="32" align="center" style={{ padding: '100px' }}>
            <HStack gap="32" justify="center">
                <Tooltip title="Подсказка сверху" placement="top">
                    <Button variant="outline">Сверху</Button>
                </Tooltip>
            </HStack>
            <HStack gap="32" justify="center">
                <Tooltip title="Подсказка слева" placement="left">
                    <Button variant="outline">Слева</Button>
                </Tooltip>
                <Tooltip title="Подсказка справа" placement="right">
                    <Button variant="outline">Справа</Button>
                </Tooltip>
            </HStack>
            <HStack gap="32" justify="center">
                <Tooltip title="Подсказка снизу" placement="bottom">
                    <Button variant="outline">Снизу</Button>
                </Tooltip>
            </HStack>
        </VStack>
    )
}

export const MobileDemo: Story = {
    render: () => (
        <VStack gap="16" style={{ padding: '20px' }}>
            <p style={{ color: 'var(--text-redesigned)', marginBottom: '16px' }}>
                На мобильных устройствах tooltip открывается по клику/тапу.
                Протестируйте на телефоне или в DevTools с эмуляцией touch.
            </p>
            <HStack gap="16">
                <Tooltip title="Температура определяет креативность модели. Выше - более случайные ответы." placement="top">
                    <HelpOutlineIcon fontSize="small" style={{ color: 'var(--hint-redesigned)', cursor: 'help' }} />
                </Tooltip>
                <span style={{ color: 'var(--text-redesigned)' }}>Температура</span>
            </HStack>
        </VStack>
    )
}
