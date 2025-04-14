import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ToolAddParam } from './ToolAddParam'

export default {
  title: 'shared/ToolAddParam',
  component: ToolAddParam,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ToolAddParam>

const Template: ComponentStory<typeof ToolAddParam> = (args) => <ToolAddParam {...args} />

export const Normal = Template.bind({})
Normal.args = {}
