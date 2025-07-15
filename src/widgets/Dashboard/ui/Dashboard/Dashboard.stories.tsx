import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Dashboard } from './Dashboard'

export default {
  title: 'widget/Dashboard',
  component: Dashboard,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof Dashboard>

const Template: ComponentStory<typeof Dashboard> = (args) => <Dashboard />

export const Normal = Template.bind({})
Normal.args = {}
