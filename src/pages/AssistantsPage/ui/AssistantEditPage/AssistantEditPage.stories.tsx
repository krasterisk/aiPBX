import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AssistantEditPage from './AssistantEditPage'

export default {
  title: 'pages/AssistantEditPage',
  component: AssistantEditPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantEditPage>

const Template: ComponentStory<typeof AssistantEditPage> = (args) => <AssistantEditPage />

export const Normal = Template.bind({})
Normal.args = {}
