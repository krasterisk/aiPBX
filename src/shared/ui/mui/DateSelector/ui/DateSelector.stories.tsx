import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { DateSelector } from './DateSelector'

export default {
  title: 'shared/DateSelector',
  component: DateSelector,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof DateSelector>

const Template: ComponentStory<typeof DateSelector> = (args) => <DateSelector {...args} />

export const Normal = Template.bind({})
Normal.args = {}
