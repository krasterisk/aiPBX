import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ToolCreateCard } from './ToolCreateCard'

export default {
  title: 'features/ToolCreateCard',
  component: ToolCreateCard,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ToolCreateCard>

const Template: ComponentStory<typeof ToolCreateCard> = (args) => <ToolCreateCard {...args} />

export const Normal = Template.bind({})
Normal.args = {}
