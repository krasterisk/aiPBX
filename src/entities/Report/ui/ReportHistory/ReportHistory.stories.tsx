import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ReportHistory } from './ReportHistory'

export default {
  title: 'entities/Report/ReportHistory',
  component: ReportHistory,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ReportHistory>

const Template: ComponentStory<typeof ReportHistory> = (args) => <ReportHistory {...args} />

export const Normal = Template.bind({})
Normal.args = {}
