import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantOptionsMain } from './AssistantOptionsMain'

export default {
  title: 'shared/AssistantOptionsMain',
  component: AssistantOptionsMain,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantOptionsMain>

const Template: ComponentStory<typeof AssistantOptionsMain> = (args) => <AssistantOptionsMain {...args} />

export const Normal = Template.bind({})
Normal.args = {}
