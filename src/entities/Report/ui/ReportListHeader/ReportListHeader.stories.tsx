import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ReportsListHeader } from './ReportListHeader'

export default {
  title: 'shared/ReportListHeader',
  component: ReportsListHeader,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ReportsListHeader>

const Template: ComponentStory<typeof ReportsListHeader> = (args) => <ReportsListHeader {...args} />

export const Normal = Template.bind({})
Normal.args = {}
