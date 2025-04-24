import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ReportListHeader } from './ReportListHeader'

export default {
  title: 'shared/ReportListHeader',
  component: ReportListHeader,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ReportListHeader>

const Template: ComponentStory<typeof ReportListHeader> = (args) => <ReportListHeader {...args} />

export const Normal = Template.bind({})
Normal.args = {}
