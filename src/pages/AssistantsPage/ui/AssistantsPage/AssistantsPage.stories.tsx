import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AssistantsPage from './AssistantsPage'

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
