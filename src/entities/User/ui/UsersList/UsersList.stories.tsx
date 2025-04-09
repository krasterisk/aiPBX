import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { UsersList } from './UsersList'

export default {
  title: 'shared/UsersList',
  component: UsersList,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof UsersList>

const Template: ComponentStory<typeof UsersList> = (args) => <UsersList {...args} />

export const Normal = Template.bind({})
Normal.args = {}
