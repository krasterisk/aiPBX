import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { UserAddAvatar } from './UserAddAvatar'

export default {
  title: 'shared/UserAddAvatar',
  component: UserAddAvatar,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof UserAddAvatar>

const Template: ComponentStory<typeof UserAddAvatar> = (args) => <UserAddAvatar {...args} />

export const Normal = Template.bind({})
Normal.args = {}
