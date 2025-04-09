import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantCreateCardHeader } from './AssistantCreateCardHeader'

export default {
  title: 'features/AssistantCreateCardHeader',
  component: AssistantCreateCardHeader,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantCreateCardHeader>

const Template: ComponentStory<typeof AssistantCreateCardHeader> = (args) => <AssistantCreateCardHeader {...args} />

export const Normal = Template.bind({})
Normal.args = {}
