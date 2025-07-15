import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { SummaryCard } from './SummaryCard'

export default {
  title: 'shared/SummaryCard',
  component: SummaryCard,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof SummaryCard>

const Template: ComponentStory<typeof SummaryCard> = (args) => <SummaryCard {...args} />

export const Normal = Template.bind({})
Normal.args = {}
