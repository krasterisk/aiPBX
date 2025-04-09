import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantItem } from './AssistantItem'

export default {
  title: 'entities/AssistantItem',
  component: AssistantItem,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantItem>

const Template: ComponentStory<typeof AssistantItem> = (args) => <AssistantItem {...args} />

export const Normal = Template.bind({})
Normal.args = {}
