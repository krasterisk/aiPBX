import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { RoleSelect } from './RoleSelect'

export default {
  title: 'shared/RoleSelect',
  component: RoleSelect,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof RoleSelect>

const Template: ComponentStory<typeof RoleSelect> = (args) => <RoleSelect {...args} />

export const Normal = Template.bind({})
Normal.args = {}
