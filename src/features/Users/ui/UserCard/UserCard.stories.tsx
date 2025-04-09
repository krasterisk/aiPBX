import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { UserCard } from './UserCard'

export default {
  title: 'shared/UserCard',
  component: UserCard,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof UserCard>

const Template: ComponentStory<typeof UserCard> = (args) => <UserCard {...args} />

export const Normal = Template.bind({})
Normal.args = {}
