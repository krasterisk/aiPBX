import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { TelegramSignup } from './TelegramSignup'

export default {
  title: 'shared/Telegram',
  component: TelegramSignup,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof TelegramSignup>

const Template: ComponentStory<typeof TelegramSignup> = (args) => <TelegramSignup {...args} />

export const Normal = Template.bind({})
Normal.args = {}
