import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantCard } from './AssistantCard'

export default {
  title: 'features/AssistantCard',
  component: AssistantCard,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantCard>

const Template: ComponentStory<typeof AssistantCard> = (args) => <AssistantCard {...args} />

export const Normal = Template.bind({})
Normal.args = {}
