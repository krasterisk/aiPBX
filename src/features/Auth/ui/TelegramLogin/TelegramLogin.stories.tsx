import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { TelegramLogin } from './TelegramLogin'


export default {
    title: 'shared/TelegramLogin',
    component: TelegramLogin,
    argTypes: {
        backgroundColor: { control: 'color' }
    }
} as ComponentMeta<typeof TelegramLogin>

const Template: ComponentStory<typeof TelegramLogin> = (args) => <TelegramLogin {...args} />

export const Normal = Template.bind({})
Normal.args = {
    
}

