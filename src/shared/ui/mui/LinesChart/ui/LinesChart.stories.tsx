import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { LinesChart } from './LinesChart'

export default {
  title: 'shared/Linechart',
  component: LinesChart,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof LinesChart>

const Template: ComponentStory<typeof LinesChart> = (args) => <LinesChart {...args} />

export const Normal = Template.bind({})
Normal.args = {}
