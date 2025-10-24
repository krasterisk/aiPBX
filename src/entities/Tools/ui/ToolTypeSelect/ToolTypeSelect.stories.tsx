import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ToolTypeSelect } from './ToolTypeSelect'

export default {
  title: 'shared/ToolTypeSelect',
  component: ToolTypeSelect,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ToolTypeSelect>

const Template: ComponentStory<typeof ToolTypeSelect> = (args) => <ToolTypeSelect {...args} />

export const Normal = Template.bind({})
Normal.args = {}
