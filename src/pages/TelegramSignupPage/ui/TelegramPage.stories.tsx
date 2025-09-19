import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { TelegramSignupPageAsync as TelegramSignupPage } from './TelegramSignupPage.async'

export default {
  title: 'pages/TelegramPage',
  component: TelegramSignupPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof TelegramSignupPage>

const Template: ComponentStory<typeof TelegramSignupPage> = (args) => <TelegramSignupPage />

export const Normal = Template.bind({})
Normal.args = {}
