import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Telegram } from './Telegram'

export default {
  title: 'shared/Telegram',
  component: Telegram,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof Telegram>

const Template: ComponentStory<typeof Telegram> = (args) => <Telegram {...args} />

export const Normal = Template.bind({})
Normal.args = {}
