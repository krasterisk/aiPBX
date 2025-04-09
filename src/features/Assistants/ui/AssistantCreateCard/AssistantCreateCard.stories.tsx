import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantCreateCard } from './AssistantCreateCard'

export default {
  title: 'features/AssistantCreateCard',
  component: AssistantCreateCard,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantCreateCard>

const Template: ComponentStory<typeof AssistantCreateCard> = (args) => <AssistantCreateCard {...args} />

export const Normal = Template.bind({})
Normal.args = {}
