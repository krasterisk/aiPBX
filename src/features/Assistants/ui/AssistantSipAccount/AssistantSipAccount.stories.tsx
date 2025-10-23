import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantSipAccount } from './AssistantSipAccount'

export default {
  title: 'shared/AssistantSipAccount',
  component: AssistantSipAccount,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantSipAccount>

const Template: ComponentStory<typeof AssistantSipAccount> = (args) => <AssistantSipAccount {...args} />

export const Normal = Template.bind({})
Normal.args = {}
