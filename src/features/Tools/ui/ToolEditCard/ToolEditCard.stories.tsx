import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ToolEditCard } from './ToolEditCard'

export default {
  title: 'features/ToolEditCard',
  component: ToolEditCard,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ToolEditCard>

const Template: ComponentStory<typeof ToolEditCard> = (args) => <ToolEditCard {...args} />

export const Normal = Template.bind({})
Normal.args = {}
