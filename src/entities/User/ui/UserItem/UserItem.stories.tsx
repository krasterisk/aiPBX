import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { UserItem } from './UserItem'

export default {
  title: 'shared/UserItem',
  component: UserItem,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof UserItem>

const Template: ComponentStory<typeof UserItem> = (args) => <UserItem {...args} />

export const Normal = Template.bind({})
Normal.args = {}
