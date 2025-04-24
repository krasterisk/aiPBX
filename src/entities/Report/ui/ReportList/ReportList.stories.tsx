import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ReportList } from './ReportList'

export default {
  title: 'features/Report',
  component: ReportList,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ReportList>

const Template: ComponentStory<typeof ReportList> = (args) => <ReportList {...args} />

export const Normal = Template.bind({})
Normal.args = {}
