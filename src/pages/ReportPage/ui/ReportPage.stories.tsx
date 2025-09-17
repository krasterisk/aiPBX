import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ReportPageAsync as ReportPage } from './ReportPage.async'

export default {
  title: 'shared/ReportPage',
  component: ReportPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof ReportPage>

const Template: ComponentStory<typeof ReportPage> = (args) => <ReportPage {...args} />

export const Normal = Template.bind({})
Normal.args = {}
