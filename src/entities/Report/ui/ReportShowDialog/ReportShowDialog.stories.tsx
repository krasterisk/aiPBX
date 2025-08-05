import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ReportShowDialog } from './ReportShowDialog'

export default {
  title: 'shared/ReportShowDialog',
  component: ReportShowDialog,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ReportShowDialog>

const Template: ComponentStory<typeof ReportShowDialog> = (args) => <ReportShowDialog {...args} />

export const Normal = Template.bind({})
Normal.args = {}
