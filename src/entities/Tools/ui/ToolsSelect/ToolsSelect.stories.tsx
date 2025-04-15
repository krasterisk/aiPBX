import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ToolsSelect } from './ToolsSelect'

export default {
  title: 'entities/ToolsSelector',
  component: ToolsSelect,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ToolsSelect>

const Template: ComponentStory<typeof ToolsSelect> = (args) => <ToolsSelect {...args} />

export const Normal = Template.bind({})
Normal.args = {}
