import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ReportItem } from './ReportItem'

export default {
  title: 'shared/ReportItem',
  component: ReportItem,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ReportItem>

const Template: ComponentStory<typeof ReportItem> = (args) => <ReportItem {...args} />

export const Normal = Template.bind({})
Normal.args = {}
