import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { PeriodPicker } from './PeriodPicker'

export default {
  title: 'shared/PeriodPicker',
  component: PeriodPicker,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof PeriodPicker>

const Template: ComponentStory<typeof PeriodPicker> = (args) => <PeriodPicker {...args} />

export const Normal = Template.bind({})
Normal.args = {}
