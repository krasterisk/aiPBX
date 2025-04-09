import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { UsersSortSelector } from './UsersSortSelector'

export default {
  title: 'shared/EndpointsSortSelector',
  component: UsersSortSelector,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof UsersSortSelector>

const Template: ComponentStory<typeof UsersSortSelector> = (args) => <UsersSortSelector {...args} />

export const Normal = Template.bind({})
Normal.args = {}
