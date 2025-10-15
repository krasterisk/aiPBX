import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ToolItem } from './ToolItem'

export default {
  title: 'entities/AssistantItem',
  component: ToolItem,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ToolItem>

const Template: ComponentStory<typeof ToolItem> = (args) => <ToolItem {...args} />

export const Normal = Template.bind({})
Normal.args = {}
