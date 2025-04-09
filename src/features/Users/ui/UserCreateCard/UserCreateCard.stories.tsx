import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { UserCreateCard } from './UserCreateCard'

export default {
  title: 'shared/UserCreateCard',
  component: UserCreateCard,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof UserCreateCard>

const Template: ComponentStory<typeof UserCreateCard> = (args) => <UserCreateCard {...args} />

export const Normal = Template.bind({})
Normal.args = {}
