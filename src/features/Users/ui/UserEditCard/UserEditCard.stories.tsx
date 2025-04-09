import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { UserEditCard } from './UserEditCard'

export default {
  title: 'shared/UserEditCard',
  component: UserEditCard,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof UserEditCard>

const Template: ComponentStory<typeof UserEditCard> = (args) => <UserEditCard {...args} />

export const Normal = Template.bind({})
Normal.args = {}
