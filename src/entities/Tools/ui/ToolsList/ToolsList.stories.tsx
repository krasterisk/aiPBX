import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ToolsList } from './ToolsList'

export default {
  title: 'entities/ToolsList',
  component: ToolsList,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ToolsList>

const Template: ComponentStory<typeof ToolsList> = (args) => <ToolsList {...args} />

export const Normal = Template.bind({})
Normal.args = {}
