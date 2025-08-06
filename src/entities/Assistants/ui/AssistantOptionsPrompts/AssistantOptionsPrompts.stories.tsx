import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantOptionsPrompts } from './AssistantOptionsPrompts'

export default {
  title: 'shared/AssistantOptionsPrompts',
  component: AssistantOptionsPrompts,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantOptionsPrompts>

const Template: ComponentStory<typeof AssistantOptionsPrompts> = (args) => <AssistantOptionsPrompts {...args} />

export const Normal = Template.bind({})
Normal.args = {}
