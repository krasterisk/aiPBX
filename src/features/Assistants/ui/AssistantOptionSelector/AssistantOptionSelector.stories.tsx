import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantOptionSelecter } from './AssistantOptionSelector'

export default {
  title: 'shared/AddistantOptionSelecter',
  component: AssistantOptionSelecter,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantOptionSelecter>

const Template: ComponentStory<typeof AssistantOptionSelecter> = (args) => <AssistantOptionSelecter {...args} />

export const Normal = Template.bind({})
Normal.args = {}
