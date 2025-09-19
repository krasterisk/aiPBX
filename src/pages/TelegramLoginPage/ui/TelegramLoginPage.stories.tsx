import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { TelegramLoginPage } from './TelegramLoginPage'


export default {
    title: 'shared/TelegramLoginPage',
    component: TelegramLoginPage,
    argTypes: {
        backgroundColor: { control: 'color' }
    }
} as ComponentMeta<typeof TelegramLoginPage>

const Template: ComponentStory<typeof TelegramLoginPage> = (args) => <TelegramLoginPage {...args} />

export const Normal = Template.bind({})
Normal.args = {
    
}

