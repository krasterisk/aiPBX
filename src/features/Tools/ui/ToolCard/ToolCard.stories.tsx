import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ToolCard } from './ToolCard'

export default {
  title: 'features/AssistantCard',
  component: ToolCard,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ToolCard>

const Template: ComponentStory<typeof ToolCard> = (args) => <ToolCard {...args} />

export const Normal = Template.bind({})
Normal.args = {}
