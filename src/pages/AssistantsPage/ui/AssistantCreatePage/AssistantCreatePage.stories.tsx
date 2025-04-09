import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AssistantCreatePage from './AssistantCreatePage'

export default {
  title: 'pages/AssistantCreatePage',
  component: AssistantCreatePage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantCreatePage>

const Template: ComponentStory<typeof AssistantCreatePage> = (args) => <AssistantCreatePage />

export const Normal = Template.bind({})
Normal.args = {}
