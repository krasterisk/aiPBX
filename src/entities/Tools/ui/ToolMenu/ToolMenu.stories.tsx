import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ToolMenu } from './ToolMenu'

export default {
  title: 'entities/ToolMenu',
  component: ToolMenu,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ToolMenu>

const Template: ComponentStory<typeof ToolMenu> = (args) => <ToolMenu {...args} />

export const Normal = Template.bind({})
Normal.args = {}
