import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ToolEditCardHeader } from './ToolEditCardHeader'

export default {
  title: 'shared/TerminalEditCardHeader',
  component: ToolEditCardHeader,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ToolEditCardHeader>

const Template: ComponentStory<typeof ToolEditCardHeader> = (args) => <ToolEditCardHeader {...args} />

export const Normal = Template.bind({})
Normal.args = {}
