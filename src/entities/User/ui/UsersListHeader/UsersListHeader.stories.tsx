import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { UsersListHeader } from './UsersListHeader'

export default {
  title: 'shared/UsersListHeader',
  component: UsersListHeader,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof UsersListHeader>

const Template: ComponentStory<typeof UsersListHeader> = (args) => <UsersListHeader {...args} />

export const Normal = Template.bind({})
Normal.args = {}
