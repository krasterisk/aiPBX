import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { CallCard } from './CallCard'

export default {
  title: 'shared/CallCard',
  component: CallCard,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof CallCard>

const Template: ComponentStory<typeof CallCard> = (args) => <CallCard {...args} />

export const Normal = Template.bind({})
Normal.args = {}
