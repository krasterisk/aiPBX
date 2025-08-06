import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantOptionsModel } from './AssistantOptionsModel'

export default {
  title: 'shared/AssistantOptionsModel',
  component: AssistantOptionsModel,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantOptionsModel>

const Template: ComponentStory<typeof AssistantOptionsModel> = (args) => <AssistantOptionsModel {...args} />

export const Normal = Template.bind({})
Normal.args = {}
