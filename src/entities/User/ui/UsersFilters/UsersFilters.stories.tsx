import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { UsersFilters } from './UsersFilters'

export default {
  title: 'shared/UsersFilters',
  component: UsersFilters,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof UsersFilters>

const Template: ComponentStory<typeof UsersFilters> = (args) => <UsersFilters {...args} />

export const Normal = Template.bind({})
Normal.args = {}
