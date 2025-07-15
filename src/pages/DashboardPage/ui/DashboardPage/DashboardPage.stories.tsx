import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import DashboardPage from './DashboardPage'

export default {
  title: 'shared/DashboardPage',
  component: DashboardPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof DashboardPage>

const Template: ComponentStory<typeof DashboardPage> = (args) => <DashboardPage />

export const Normal = Template.bind({})
Normal.args = {}
