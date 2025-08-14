import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantOptionSelector } from './AssistantOptionSelector'

export default {
  title: 'shared/AddistantOptionSelecter',
  component: AssistantOptionSelector,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantOptionSelector>

const Template: ComponentStory<typeof AssistantOptionSelector> = (args) => <AssistantOptionSelector {...args} />

export const Normal = Template.bind({})
Normal.args = {}
