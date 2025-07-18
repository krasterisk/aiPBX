import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { UserBalance } from './UserBalance'

export default {
  title: 'shared/UserBalance',
  component: UserBalance,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof UserBalance>

const Template: ComponentStory<typeof UserBalance> = (args) => <UserBalance {...args} />

export const Normal = Template.bind({})
Normal.args = {}
