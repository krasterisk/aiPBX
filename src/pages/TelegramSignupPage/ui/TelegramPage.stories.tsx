import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { TelegramPageAsync as TelegramPage } from './TelegramPage.async'

export default {
  title: 'pages/TelegramPage',
  component: TelegramPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof TelegramPage>

const Template: ComponentStory<typeof TelegramPage> = (args) => <TelegramPage {...args} />

export const Normal = Template.bind({})
Normal.args = {}
