import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { TelegramLoginPageAsync as TelegramLoginPage } from './TelegramLoginPage.async'

export default {
  title: 'pages/TelegramLoginPage',
  component: TelegramLoginPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof TelegramLoginPage>

const Template: ComponentStory<typeof TelegramLoginPage> = (args) => <TelegramLoginPage />

export const Normal = Template.bind({})
Normal.args = {}
