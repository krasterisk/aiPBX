import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { UserEditCardHeader } from './UserEditCardHeader'

export default {
  title: 'shared/UserEditCardHeader',
  component: UserEditCardHeader,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof UserEditCardHeader>

const Template: ComponentStory<typeof UserEditCardHeader> = (args) => <UserEditCardHeader {...args} />

export const Normal = Template.bind({})
Normal.args = {}
