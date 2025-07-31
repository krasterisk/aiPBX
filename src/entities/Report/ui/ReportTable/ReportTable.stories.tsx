import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ReportTable } from './ReportTable'

export default {
  title: 'entities/ReportTable',
  component: ReportTable,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ReportTable>

const Template: ComponentStory<typeof ReportTable> = (args) => <ReportTable {...args} />

export const Normal = Template.bind({})
Normal.args = {}
