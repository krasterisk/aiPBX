import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantCreatePageAsync as AssistantCreatePage } from './AssistantCreatePage.async'

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
