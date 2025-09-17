import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AssistantsPageAsync as AssistantsPage } from './AssistantsPage.async'

export default {
  title: 'pages/AssistantsPage',
  component: AssistantsPage,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as ComponentMeta<typeof AssistantsPage>

const Template: ComponentStory<typeof AssistantsPage> = (args) => <AssistantsPage {...args} />

export const Normal = Template.bind({})
Normal.args = {}
