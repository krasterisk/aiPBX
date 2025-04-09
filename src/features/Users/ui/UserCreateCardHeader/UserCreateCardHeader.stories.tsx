import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { UserCreateCardHeader } from './UserCreateCardHeader'

export default {
  title: 'shared/UserCreateHeader',
  component: UserCreateCardHeader,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof UserCreateCardHeader>

const Template: ComponentStory<typeof UserCreateCardHeader> = (args) => <UserCreateCardHeader {...args} />

export const Normal = Template.bind({})
Normal.args = {}
