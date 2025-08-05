import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { BarsChart } from './BarsChart'

export default {
  title: 'shared/BarsChart',
  component: BarsChart,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof BarsChart>

const Template: ComponentStory<typeof BarsChart> = (args) => <BarsChart {...args} />

export const Normal = Template.bind({})
Normal.args = {}
