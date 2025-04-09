import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Check } from './Check'

export default {
  title: 'shared/Check',
  component: Check,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof Check>

const Template: ComponentStory<typeof Check> = (args) => <Check {...args} />

export const Normal = Template.bind({})
Normal.args = {}
