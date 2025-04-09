import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantEditCard } from './AssistantEditCard'

export default {
  title: 'features/AssistantEditCard',
  component: AssistantEditCard,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantEditCard>

const Template: ComponentStory<typeof AssistantEditCard> = (args) => <AssistantEditCard {...args} />

export const Normal = Template.bind({})
Normal.args = {}
