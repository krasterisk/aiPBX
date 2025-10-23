import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantOptionsPublication } from './AssistantOptionsPublication'

export default {
  title: 'shared/AssistantPublication',
  component: AssistantOptionsPublication,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantOptionsPublication>

const Template: ComponentStory<typeof AssistantOptionsPublication> = (args) => <AssistantOptionsPublication {...args} />

export const Normal = Template.bind({})
Normal.args = {}
