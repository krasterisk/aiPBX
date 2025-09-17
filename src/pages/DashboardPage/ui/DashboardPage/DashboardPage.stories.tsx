import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { DashboardPageAsync as DashboardPage } from './DashboardPage.async'

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
