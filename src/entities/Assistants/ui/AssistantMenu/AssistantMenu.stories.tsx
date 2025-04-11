import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantMenu } from './AssistantMenu'

export default {
  title: 'entities/AssistantMenu',
  component: AssistantMenu,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantMenu>

const Template: ComponentStory<typeof AssistantMenu> = (args) => <AssistantMenu {...args} />

export const Normal = Template.bind({})
Normal.args = {}
