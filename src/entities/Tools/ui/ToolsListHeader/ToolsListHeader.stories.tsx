import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ToolsListHeader } from './ToolsListHeader'

export default {
  title: 'entities/ToolsListHeader',
  component: ToolsListHeader,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ToolsListHeader>

const Template: ComponentStory<typeof ToolsListHeader> = (args) => <ToolsListHeader {...args} />

export const Normal = Template.bind({})
Normal.args = {}
