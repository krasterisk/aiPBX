import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ToolCreateCardHeader } from './ToolCreateCardHeader'

export default {
  title: 'features/ToolCreateCardHeader',
  component: ToolCreateCardHeader,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ToolCreateCardHeader>

const Template: ComponentStory<typeof ToolCreateCardHeader> = (args) => <ToolCreateCardHeader {...args} />

export const Normal = Template.bind({})
Normal.args = {}
